import { DataTypes } from 'sequelize';
import { sequelize } from '../db/DBConfig.js';
import Users from './Admin.js';

const PasswordResetRequest = sequelize.define("PasswordResetRequest", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'resolved'),
        defaultValue: 'pending'
    },
    newPassword: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetBy: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        allowNull: true
    },
    resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

Users.hasMany(PasswordResetRequest, { foreignKey: 'userId', onDelete: 'CASCADE' });
PasswordResetRequest.belongsTo(Users, { foreignKey: 'userId', as: 'requestedBy' });

export default PasswordResetRequest;
