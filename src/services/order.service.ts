import { ROLE } from '@/constants/allowedRoles';
import { ORDER_STATUS } from '@/constants/order';
import { BadRequestError, BadRequestFormError, NotAcceptableError, NotFoundError } from '@/error/customError';
import APIQuery from '@/helpers/apiQuery';

import customResponse from '@/helpers/response';
import { ItemOrder } from '@/interfaces/schema/order';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import _ from 'lodash';

export const updateStockOnCreateOrder = async (dataItems: ItemOrder[]) => {
    return await Promise.all(
        dataItems.map(async (item: ItemOrder) => {
            await Product.updateOne(
                { _id: item.productId },
                {
                    $inc: {
                        stock: -item.quantity,
                        sold: item.quantity,
                    },
                },
            );
        }),
    );
};
export const updateStockOnCancelOrder = async (dataItems: ItemOrder[]) => {
    return await Promise.all(
        dataItems.map(async (item: ItemOrder) => {
            await Product.updateOne(
                { _id: item.productId },
                {
                    $inc: {
                        stock: item.quantity,
                        sold: -item.quantity,
                    },
                },
            );
        }),
    );
};

const checkProductStatus = async (items: ItemOrder[]) => {
    const products = await Product.find({
        _id: { $in: items.map((item: ItemOrder) => item.productId) },
    }).select('stock isHide');

    if (!products) throw new NotFoundError('Không tìm thấy sản phẩm');

    const isOutOfStock = products.some((item) => {
        const productTarget = items.find((pro: ItemOrder) => pro.productId === String(item._id));
        if (productTarget!.quantity > item.stock!) {
            return true;
        }
    });
    const isHidedProduct = products.some((item) => {
        if (item.isHide) {
            return true;
        }
    });

    if (isOutOfStock) {
        throw new NotAcceptableError('Sản phẩm đã hết hàng');
    }
    if (isHidedProduct) {
        throw new NotAcceptableError('Sản phẩm đã không tồn tại');
    }
};

// @Post
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const order = new Order({
        ...req.body,
        userId: req.userId,
    });

    await checkProductStatus(req.body.items);

    await order.save();

    await updateStockOnCreateOrder(req.body.items);

    await Promise.all(
        req.body.items.map(async (product: any) => {
            await Cart.findOneAndUpdate(
                { userId: req.userId },
                { $pull: { items: { productId: product.productId } } },
                { new: true },
            );
        }),
    );

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: req.body,
            status: StatusCodes.CREATED,
            success: true,
            message: 'Đặt hàng thành công',
        }),
    );
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? +req.query.page : 1;
    req.query.limit = String(req.query.limit || 10);
    const searchString = req.query.rawsearch;
    const searchQuery = searchString ? { 'customerInfo.name': { $regex: searchString, $options: 'i' } } : {};
    const features = new APIQuery(Order.find(searchQuery), req.query);

    features.filter().sort().limitFields().search().paginate();

    const [orders, totalDocs] = await Promise.all([features.query, features.count()]);
    const totalPages = Math.ceil(Number(totalDocs) / +req.query.limit);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                orders,
                page,
                totalDocs,
                totalPages,
            },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

//@GET: Get all orders by user
export const getAllOrdersByUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const page = req.query.page ? +req.query.page : 1;
    req.query.limit = String(req.query.limit || 10);

    const features = new APIQuery(Order.find({ userId }), req.query);
    features.filter().sort().limitFields().search().paginate();

    const [orders, totalDocs] = await Promise.all([features.query, features.count()]);
    const totalPages = Math.ceil(Number(totalDocs) / +req.query.limit);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                orders,
                page,
                totalDocs,
                totalPages,
            },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

export const getDetailedOrder = async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
        throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} order with id: ${req.params.id}`);
    }
    const result = _.omit(order, ['updatedAt']);

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: result, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

//@POST Set order status to confirmled
export const confirmOrder = async (req: Request, res: Response, next: NextFunction) => {
    const foundedOrder = await Order.findOne({ _id: req.body.orderId });

    if (!foundedOrder) {
        throw new BadRequestError(`Không tìm thấy đơn hàng với id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus !== ORDER_STATUS.PENDING) {
        throw new NotAcceptableError(
            `Bạn không thể xác nhận đơn hàng bởi vì nó đã được xử lý hoặc đã được hoàn thành. `,
        );
    } else {
        if (req.role !== ROLE.ADMIN) {
            throw new NotAcceptableError('Bạn không có quyền làm điều này!');
        }

        foundedOrder.orderStatus = ORDER_STATUS.CONFIRMED;
        foundedOrder.description = req.body.description ?? '';
        foundedOrder.save();

        // Update stock
        await updateStockOnCreateOrder(foundedOrder.items);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: req.body,
            success: true,
            status: StatusCodes.OK,
            message: 'Đơn hàng đã được xác nhận.',
        }),
    );
};

//@POST Set order status to cancelled
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    const foundedOrder = await Order.findOne({ _id: req.body.orderId });

    if (!foundedOrder) {
        throw new BadRequestError(`Không tìm thấy đơn hàng với id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.CANCELLED) {
        throw new NotAcceptableError(`Bạn không thể hủy đơn hàng này bởi vì nó đã được hủy trước đố. `);
    }

    if (foundedOrder.orderStatus !== ORDER_STATUS.DELIVERED && foundedOrder.orderStatus !== ORDER_STATUS.DONE) {
        if (req.role !== ROLE.ADMIN && foundedOrder.orderStatus !== ORDER_STATUS.PENDING) {
            throw new NotAcceptableError('Bạn không được phép hủy đơn vui lòng liên hệ nếu có vấn đề');
        }
        if (req.role === ROLE.ADMIN) {
            foundedOrder.canceledBy = ROLE.ADMIN;
        }

        foundedOrder.orderStatus = ORDER_STATUS.CANCELLED;
        foundedOrder.description = req.body.description ?? '';
        foundedOrder.save();

        // Update stock
        await updateStockOnCancelOrder(foundedOrder.items);
    } else {
        throw new NotAcceptableError(`Đơn hàng của bạn đã được giao không thể hủy đơn`);
    }

    return res
        .status(StatusCodes.OK)
        .json(
            customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'Your order is cancelled.' }),
        );
};

// @Set order status to shipping
export const shippingOrder = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.role || req.role !== 'admin') {
        throw new NotAcceptableError('Chỉ có admin mới có quyền truy cập.');
    }

    const foundedOrder = await Order.findOne({
        _id: req.body.orderId,
    });

    if (!foundedOrder) {
        throw new BadRequestError(`Không tìm thấy order với id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.CONFIRMED) {
        foundedOrder.orderStatus = ORDER_STATUS.SHIPPING;
        await foundedOrder.save();
    } else {
        throw new BadRequestError(`Đơn hàng của bạn chưa được xác nhận.`);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: 'Đơn hàng của bạn đang được vận chuyển.',
        }),
    );
};

// @ Set order status to delivered
export const deliverOrder = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.role || req.role !== 'admin') {
        throw new NotAcceptableError('Chỉ có admin mới có quyền truy cập..');
    }

    const foundedOrder = await Order.findOne({ _id: req.body.orderId });

    if (!foundedOrder) {
        throw new BadRequestError(`Không tìm thấy order với id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.SHIPPING) {
        foundedOrder.orderStatus = ORDER_STATUS.DELIVERED;
        foundedOrder.save();
    } else {
        throw new BadRequestError(`Đơn hàng của bạn đã được vận chuyển.`);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: 'Đơn hàng của bạn đã được vận chuyển.',
        }),
    );
};

// @Set order status to done
export const finishOrder = async (req: Request, res: Response, next: NextFunction) => {
    const foundedOrder = await Order.findOne({ _id: req.body.orderId });

    if (!foundedOrder) {
        throw new BadRequestError(`Không tìm thấy đơn hàng với id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.DELIVERED) {
        foundedOrder.orderStatus = ORDER_STATUS.DONE;
        foundedOrder.isPaid = true;
        foundedOrder.save();
    } else {
        throw new BadRequestError(`Đơn hàng của bạn đã hoàn thành.`);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: 'Đơn hàng của bạn đã hoàn thành.',
        }),
    );
};
