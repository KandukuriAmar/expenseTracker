import jwt from 'jsonwebtoken';
import Users from '../models/Admin.js';

const authMiddleware = async (req, res, next) => {
    if(req.cookies && req.cookies.token) {
        const token = req.cookies.token;
        try {
            const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
            const getUser = await Users.findOne({where: {email: decodedUser.email}});
            if(!getUser) {
                return res.status(404).json({message: "User not found"});
            }
            req.user = {
                id: getUser.id,
                email: getUser.email,	
                role: getUser.role,
            }
            next();
        } catch (error) {
            return res.status(401).json({message: "Invalid token at authMiddleware, ", error});
        }
    } else {
        return res.status(401).json({message: "No token provided"});
    }
}

export default authMiddleware;