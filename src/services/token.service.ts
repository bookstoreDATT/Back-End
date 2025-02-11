import jwt from 'jsonwebtoken';

export const generateToken = (user: any, key: string, expires: string) => {
    const payload = { userId: user._id, role: user.role };
    const secreteKey = key;
    return jwt.sign(payload, secreteKey, { expiresIn: expires });
};
