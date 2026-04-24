import 'dotenv/config';
import { sequelize } from '../models/index.js';

const migrate = async () => {
    console.log('🔄 Running database migrations (Sequelize Sync)...');

    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established.');

        // Sync all models
        // Note: In production, you'd use migrations instead of sync({ alter: true })
        await sequelize.sync({ alter: true });
        
        console.log('✅ Database schema synced successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
};

migrate();

