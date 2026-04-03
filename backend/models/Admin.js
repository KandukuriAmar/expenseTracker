import { DataTypes } from 'sequelize';
import { sequelize } from '../db/DBConfig.js';

const Users = sequelize.define("Users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, name: {
        type: DataTypes.STRING,
        allowNull: false
    }, email: {
        type: DataTypes.STRING,
        allowNull: false
    }, password: {
        type: DataTypes.STRING,
        allowNull: false
    }, role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "admin"
    }, isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

export default Users;