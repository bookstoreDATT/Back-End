import { ROLE } from '@/constants/allowedRoles';
import { z } from 'zod';

// Schema cho tạo danh mục
export const createCategoryValidation = z.object({
    name: z
        .string({ message: 'Tên danh mục không được để trống!' })
        .min(3, { message: 'Tên danh mục phải có ít nhất 3 ký tự!' })
        .max(50, { message: 'Tên danh mục không được vượt quá 50 ký tự!' }),
});
