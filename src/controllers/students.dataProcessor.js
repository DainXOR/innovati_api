import studentSchema from "../models/studentSchema";
import { subjectsProcessor } from "./subjects.dataProcessor";
import { dataProcessor } from "./dataProcessor";
import { status } from "./error_codes";

export class studentsProcessor {
    static async getAllStudents() {
        let result = {};
        let state = status.PROCESSING;
        let message = "";
        let data = {};

        try {
            const subjects = await studentSchema.findAll();

            if (subjects.length > 0) {
                state = status.OK;
                message = "Students retrieved successfully";
                data = {
                    count: subjects.length,
                    subjects
                };
            } else {
                state = status.NOT_FOUND;
                message = "Not found: No students found";
            }

        } catch (error) {
            state = status.INTERNAL_SERVER_ERROR;
            message = error.message,
            data = error
        }

        result = {
            state,
            message,
            data
        };
        return result;
    }
    static async getStudent(req) {
        const { document } = req.params;

        let result = {};
        let state = status.PROCESSING;
        let message = "";
        let data = {};
        
        try {
            const student = await studentSchema.findOne({
                where: {
                    document
                }
            });
            if (student) {
                state = status.OK;
                message = "Success";
                data = student;
            } else {
                state = status.NOT_FOUND;
                message = "Not found: Student not found";
            }
        } catch (error) {
            state = status.INTERNAL_SERVER_ERROR;
            message = error.message,
            data = error
        }

        result = {
            state,
            message,
            data
        };
        return result;
    }

    static async createStudent(req) {
        const { document, name, lastname, email, phone } = req.body;
        let result = {};
        let state = status.PROCESSING;
        let message = "";
        let data = {};

        try {
            studentsProcessor.validateDocument(document, {state});
            studentsProcessor.validateStudent(req, {state});
            console.log(state);


            const newStudent = await studentSchema.create({
                document,
                name,
                lastname,
                email,
                phone
            }, {
                fields: ["document", "name", "lastname", "email", "phone"]
            });
        
            if (newStudent) {
                state = status.CREATED;
                message = "Success";
                data = newStudent;
            }
        } catch (error) {
            state = status.INTERNAL_SERVER_ERROR;
            message = error.message,
            data = error
        }

        result = {
            state,
            message,
            data
        };
        return result;
    }

    static async deleteStudent(req) {
        const { document } = req.params;
        let result = {};
        let state = status.PROCESSING;
        let message = "";
        let data = {};

        try {
            const deleteRowCount = await studentSchema.destroy({
                where: {
                    document
                }
            });
            if (deleteRowCount > 0) {
                state = status.OK;
                message = "Success";
                data = {
                    count: deleteRowCount
                };
            } else {
                state = status.NOT_FOUND;
                message = "Not found: Student not found";
            }
        } catch (error) {
            state = status.INTERNAL_SERVER_ERROR;
            message = error.message,
            data = error
        }

        result = {
            state,
            message,
            data
        };
        return result;
    }

    static async updateStudent(req) {
        const { document } = req.params;
        const { name, lastname, email, phone, current_subjects, complete_subjects, active } = req.body;
        let result = {};
        let state = status.PROCESSING;
        let message = "";
        let data = {};

        try {
            if (document) studentsProcessor.validateDocument(document, {state});

            let student = await studentSchema.findOne({
                attributes: ["name", "lastname", "email", "phone", "current_subjects", "complete_subjects", "active", "updated_at"],
                where: {
                    document
                }
            });
        
            if (student) {
                await studentSchema.update({
                    name,
                    lastname,
                    email,
                    phone,
                    current_subjects,
                    complete_subjects,
                    active,
                    updated_at: new Date()
                }, {
                    where: {
                        document
                    }
                });
        
                student = await studentSchema.findOne({
                    where: {
                        document
                    }
                });
                state = status.OK;
                message = "Success";
                data = {
                    student
                };
            } else {
                state = status.NOT_FOUND;
                message = "Not found: Student not found";
            }
        } catch (error) {
            state = status.INTERNAL_SERVER_ERROR;
            message = error.message,
            data = error
        }

        result = {
            state,
            message,
            data
        };
        return result;
    }

    static async updateStudentState(req) {
        const { document } = req.params;
        const { active } = req.body;
        let result = {};
        let state = status.PROCESSING;
        let message = "";
        let data = {};

        try {
            if (document) studentsProcessor.validateDocument(document, {state});

            let student = await studentSchema.findOne({
                attributes: ["active", "updated_at"],
                where: {
                    document
                }
            });
        
            if (student) {
                await studentSchema.update({
                    active,
                    updated_at: new Date()
                }, {
                    where: {
                        document
                    }
                });
        
                student = await studentSchema.findOne({
                    where: {
                        document
                    }
                });
                state = status.OK;
                message = "Success";
                data = {
                    student
                };
            } else {
                state = status.NOT_FOUND;
                message = "Not found: Student not found";
            }
        } catch (error) {
            state = status.INTERNAL_SERVER_ERROR;
            message = error.message,
            data = error
        }

        result = {
            state,
            message,
            data
        };
        return result;
    }

    static async dataOf(document) {
        if (document) studentsProcessor.validateDocument(document, {state});

        const student = await studentSchema.findOne({
            where: {
                document
            }
        });
    }
    static validateDocument(doc, stateRef) {
        const filteredDocument = Number.parseInt(doc);
            if (!Number.isInteger(filteredDocument)) {
                stateRef.state = status.NOT_ACCEPTABLE;
                throw new Error(`The id must be an integer (${doc})`);
            }
    }
    static validateDoc(document){
        return Number.isInteger(Number.parseInt(document));
    }
    static validateStudent(req, stateRef) {
        const { document, name, lastname, email, phone } = req.body;
        const typeList = ["number", "string", "string", "string", "number"];
        const dataList = [document, name, lastname, email, phone];

        const typeCheck = dataProcessor.checkTypes(dataList, typeList);
        if (typeCheck != status.ACCEPTED) {
            stateRef.state = status.NOT_ACCEPTABLE;
            let message = "Invalid values: " ;
            message += `The data types must be: ${typeList.join(", ")} in that order`;
            throw new Error(message);
        }

        return stateRef.state;
    }
}
