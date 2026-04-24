import sequelize from '../config/db.js';
import User from './User.js';
import Task from './Task.js';
import ActivityLog from './ActivityLog.js';

// Associations
User.hasMany(Task, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(ActivityLog, { foreignKey: 'user_id', onDelete: 'CASCADE' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id' });

Task.hasMany(ActivityLog, { foreignKey: 'task_id', onDelete: 'SET NULL' });
ActivityLog.belongsTo(Task, { foreignKey: 'task_id' });

export {
    sequelize,
    User,
    Task,
    ActivityLog
};
