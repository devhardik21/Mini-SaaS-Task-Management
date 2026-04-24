import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ActivityLog = sequelize.define('ActivityLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    task_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'tasks',
            key: 'id'
        }
    },
    task_title: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'activity_log',
    updatedAt: false // Activity logs usually don't need update timestamps
});

export default ActivityLog;
