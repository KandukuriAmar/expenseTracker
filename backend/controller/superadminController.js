import Users from "../models/Admin.js";
import bcrypt from 'bcrypt';

const getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll({where: {isActive: true}, attributes: {exclude: ['password']}});
        res.status(200).json({message: "Users fetched successfully by superadmin", users});
    } catch(err) {
        res.status(500).json({message: "Internal server error: ", err});
    }
}


const addUser = async(req, res) => {
    const {name, email, password, role} = req.body;
    try {
        const isExsitUser = await Users.findOne({where: {email}});
        if(isExsitUser) {
            return res.status(400).json({message: "User already exists"});
        } else {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = await Users.create({
                name,
                email,
                password: hashedPassword,
                role
            });
            res.status(200).json({message: "User added successfully by superadmin", user: newUser});
        }
    } catch(err) {        
        res.status(500).json({message: "Internal server error: ", err});
    }
}

const deleteUserById = async(req, res) => {
    const userId = req.params.id;
    try {
        const isExsitUser = await Users.findByPk(userId);
        if(!isExsitUser) {
            return res.status(400).json({message: "User not found"});
        } else {
            await Users.destroy({where: {id: userId}});
            res.status(200).json({message: "User deleted successfully by superadmin"});
        }
    } catch(err) {
        res.status(500).json({message: "Internal server error: ", err});
    }
}

const deleteUserByEmail = async(req, res) => {
    const { email } = req.params;
    try {
        const isExsitUser = await Users.findOne({where: {email}});
        if(!isExsitUser) {
            return res.status(400).json({message: "User not found"});
        } else {
            await Users.destroy({where: {email}});
            res.status(200).json({message: "User deleted successfully by superadmin"});
        }
    } catch(err) {
        res.status(500).json({message: "Internal server error: ", err});
    }
}

const updateUserById = async(req, res) => {
    try {
        const userId = req.params.id;
        const {name, role} = req.body;
        const isExsitUser = await Users.findByPk(userId);
        if(!isExsitUser) {
            return res.status(400).json({message: "User not found"});        
        } else {
            await Users.update({
                name,
                role
            }, {where: {id: userId}});
            res.status(200).json({message: "User updated successfully by superadmin"});
        }
    } catch(err) {
        res.status(500).json({message: "Internal server error: ", err});
    }
}

const toggleUserStatusById = async(req, res) => {
    try {
        const userId = req.params.id;
        const isExsitUser = await Users.findByPk(userId);   
        if(!isExsitUser) {
            return res.status(400).json({message: "User not found"});        
        } else {
            await Users.update({
                isActive: !isExsitUser.isActive
            }, {where: {id: userId}});
            res.status(200).json({message: "User status toggled successfully by superadmin"});
        }
    } catch(err) {
        res.status(500).json({message: "Internal server error: ", err});
    }
}
export {
    getAllUsers,
    addUser,
    deleteUserById,
    deleteUserByEmail,
    updateUserById,
    toggleUserStatusById
}