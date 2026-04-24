import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
        } : false
    },
    define: {
        underscored: true, // Use snake_case for fields
        timestamps: true,   // Automatically add created_at and updated_at
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

//console.log(sequelize);


export default sequelize;

