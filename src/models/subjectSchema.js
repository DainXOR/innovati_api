import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

const subjectSchema = sequelize.define('subjects', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.TEXT,
        unique: true
    },
    credits: {
        type: Sequelize.INTEGER
    },
    level: {
        type: Sequelize.INTEGER
    },
    corequisites: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    prerequisites: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    }
}, {
    timestamps: false
});

export default subjectSchema;