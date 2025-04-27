import jwt from 'jsonwebtoken';
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function authMiddleware(req, res, next) {
    let token = req.cookies.token;
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).render('error', { title: 'Unauthorized', message: 'No token provided. Please login.' });
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(req.userId);
        req.user = user || null;
        req.userId = payload.userId;
        next();
    } catch {
        return res.status(401).render('error', { title: 'Unauthorized', message: 'Invalid or expired token. Please login again.' });
    }
}