import jwt from 'jsonwebtoken';
import Users from '../models/Admin.js';

const superadminauthMiddleware = async (req, res, next) => {
    if(req.cookies && req.cookies.token) {
        const token = req.cookies.token;
        try {
            const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
            const getUser = await Users.findOne({where: {email: decodedUser.email}});
            console.log("getUser at superadminauthMiddleware: ", getUser);
            if(getUser.role !== "superadmin") {
                return res.status(403).json({message: "Access denied: Superadmin only"});
            }
            decodedUser.role = getUser.role;
            req.user = decodedUser;
            next();
        } catch (error) {
            return res.status(401).json({message: "Invalid token at superadminauthMiddleware: ", error});
        }
    } else {
        return res.status(401).json({message: "No token provided"});
    }
}

export default superadminauthMiddleware;