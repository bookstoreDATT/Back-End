import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

export const uploadImages = async (files: Express.Multer.File | Express.Multer.File[]): Promise<string[]> => {
    if (!files) throw new Error('Không tìm thấy file!');
    const fileArray = Array.isArray(files) ? files : [files];
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };
    try {
        const uploadPromises = fileArray.map((file) => {
            return new Promise<string>((resolve, reject) => {
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
