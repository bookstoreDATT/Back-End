import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

export const uploadImages = async (
    files: Express.Multer.File | Express.Multer.File[],
    folder?: string,
): Promise<string[]> => {
    if (!files) throw new Error('Không tìm thấy file!');

    const fileArray = Array.isArray(files) ? files : [files];

    try {
        const uploadPromises = fileArray.map((file) => {
            return new Promise<string>((resolve, reject) => {
                const timestamp = Date.now(); // Lấy thời gian hiện tại để đặt tên file
                const fileName = file.originalname.split('.').slice(0, -1).join('.'); // Tên file không có đuôi mở rộng
                const extension = file.originalname.split('.').pop(); // Lấy phần đuôi mở rộng
                const publicId = `${folder ? `${folder}/` : ''}${fileName}_${timestamp}`; // Đặt tên file có timestamp
                const options = {
                    public_id: publicId,
                    use_filename: true,
                    unique_filename: false,
                    overwrite: false, // Không ghi đè file cũ
                    resource_type: 'image',
                    folder, // Nếu có folder thì lưu vào folder
                };

                const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
                    if (error) return reject(error);
                    resolve(result?.secure_url || '');
                });

                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        });

        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error(error);
        throw new Error('Lỗi upload file!');
    }
};
