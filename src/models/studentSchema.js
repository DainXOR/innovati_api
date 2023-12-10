import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

const studentSchema = sequelize.define('students', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    document: {
        type: Sequelize.INTEGER,
        unique: true
    },
    name: {
        type: Sequelize.TEXT
    },
    lastname: {
        type: Sequelize.TEXT
    },
    email: {
        type: Sequelize.TEXT
    },
    phone: {
        type: Sequelize.TEXT
    },
    semester: {
        type: Sequelize.INTEGER
    },
    current_subjects: {
        type: Sequelize.JSON
    },
    complete_subjects: {
        type: Sequelize.JSON
    },
    active: {
        type: Sequelize.BOOLEAN
    },
    created_at: {
        type: Sequelize.DATE
    },
    updated_at: {
        type: Sequelize.DATE
    }
}, {
    timestamps: false
});

export default studentSchema;