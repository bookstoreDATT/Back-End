import z from 'zod';

export const registerValidation = z.object({
    userName: z
        .string({ message: 'Tên người dùng không được để trống!' })
        .min(3, { message: 'Tên người dùng phải có ít nhất 3 ký tự!' })
        .max(50, { message: 'Tên người dùng không được vượt quá 50 ký tự!' }),
    email: z.string({ message: 'Email là bắt buộc!' }).email({ message: 'Email không hợp lệ!' }),
    password: z
        .string({ message: 'Mật khẩu không được để trống!' })
        .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự!' })
        .max(20, { message: 'Mật khẩu không được dài quá 20 ký tự!' }),
});
