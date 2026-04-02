import { DataTypes } from 'sequelize';
import { sequelize } from '../db/DBConfig.js';
import Users from './Admin.js';

const Transactions = sequelize.define("Transactions", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }, userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }, title: {
        type: DataTypes.STRING,
        allowNull: false
    }, amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },type: {
        type: DataTypes.STRING,
        allowNull: false
    },  category: {
        type: DataTypes.STRING,
        allowNull: false
    }, date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }, note: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

Users.hasMany(Transactions, {foreignKey: 'userId', onDelete: 'CASCADE'});
Transactions.belongsTo(Users, {foreignKey: 'userId', onDelete: 'CASCADE'});

export default Transactions;