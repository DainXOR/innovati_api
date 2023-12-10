import subjectSchema from "../models/subjectSchema";
import { dataProcessor } from "./dataProcessor";
import { status } from "./error_codes";

export class subjectsProcessor {
    static async getAllSubjects() {
        let result = {};
        let state = status.PROCESSING;
        let message = "";
        let data = {};

        try {
            const subjects = await subjectSchema.findAll();

            if (subjects.length > 0) {
                state = status.OK;
                message = "Subjects retrieved successfully";
                data = {
                    count: subjects.length,
                    subjects
                };
            } else {
                state = status.NOT_FOUND;
                message = "Not found: No subjects found";
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
    static async getSubject(req) {
        const { id } = req.params;
        let result = {};
        let state = status.PROCESSING;
        let message = "";
        let data = {};

        try {
            subjectsProcessor.validateID(id, {state});

            const subject = await subjectSchema.findOne({
                where: {
                    id: id
                }
            });

            if (subject) {
                state = status.OK;
                message = "Subject found successfully";
                data = { subject };
            } else {
                state = status.NOT_FOUND;
                message = "Not found: Subject not found or does not exist";
                data = {};
            }
        } catch (error) {
            state = state < status.BAD_REQUEST ? status.INTERNAL_SERVER_ERROR : state;
            message = error.message;
            data = {};
        }

        result = {
            state,
            message,
            data
        };
        return result;
    }
    static async getSubjectSet(req) {
        const { ids } = req.body;
        let result = {};
        let subjects = [];
        let state = status.PROCESSING;
        let message = "";
        let data = {};

        try {
            console.log(ids);
            for (const id of ids) {
                subjectsProcessor.validateID(id, {state});
            }

            subjects = await subjectSchema.findAll({
                where: {
                    id: ids
                }
            });

            if (subjects.length < ids.length) {
                if (subjects.length === 0) {
                    state = status.OK;
                    message = "No subjects found";

                } else {
                    let missingIds = dataProcessor.missingValues(subjects.map(subject => subject.id), ids);
                    console.log(missingIds.join(", "));
                    state = status.PARTIAL_CONTENT;
                    message += `Missing ids: ${missingIds.join(", ")}\n`;
                }
            }
            else {
                state = status.OK;
                message = "Subjects found successfully";

            } 

            data = {
                count: subjects.length,
                subjects
            }

        } catch (error) {
            state = state < status.BAD_REQUEST ? status.INTERNAL_SERVER_ERROR : state;
            message = error.message;
            data = error;
        }

        result = {
            state,
            message,
            data
        };
        return result;
    }

    static async createSubject(req) {
        const { name, credits, level, corequisites, prerequisites } = req.body;
        let result = {};
        let state = status.PROCESSING;
        let message = "";
        let data = {};

        try {
            const validationResult = subjectsProcessor.validateSubject(req);
            if (validationResult.state != status.ACCEPTED) {
                state = validationResult.state;
                message = validationResult.message;
                throw new Error(message);
            }
            const subject = await subjectSchema.create({
                name,
                credits,
                level,
                corequisites,
                prerequisites
            }, {
                fields: ['name', 'credits', 'level', 'corequisites', 'prerequisites']
            });
            if (subject) {
                state = status.CREATED;
                message = "Subject created successfully";
                data = { subject };
            } else {
                state = status.BAD_REQUEST;
                message = "Could not create subject";
                data = {};
            }
        } catch (error) {
            state = state < status.BAD_REQUEST ? status.INTERNAL_SERVER_ERROR : state;
            message = error.message;
            data = error;
        }
        
        result = {
            state,
            message,
            data
        };
        return result;
    }

    static async deleteSubject(req) {
        const { id } = req.params;
        let result = {};
        let state = status.PROCESSING;
        let message = "";
        let data = {};

        try {
            subjectsProcessor.validateID(id, {state});

            const deleteRowCount = await subjectSchema.destroy({
                where: {
                    id
                }
            });

            if (deleteRowCount > 0) {
                state = status.OK;
                message = "Subject deleted successfully";
                data = { deleteRowCount };
            } else {
                state = status.NOT_FOUND;
                message = "Not found: Subject not found or does not exist";
                data = {};
            }
        } catch (error) {
            state = state < status.BAD_REQUEST ? status.INTERNAL_SERVER_ERROR : state;
            message = error.message;
            data = error;
        }

        result = {
            state,
            message,
            data
        };
        return result;
    }

    static async updateSubject(req) {
        const { id } = req.params;
        const { name, credits, level, corequisites, prerequisites } = req.body;
        let result = {};
        let state = status.PROCESSING;
        let message = "";
        let data = {};

        try {
            subjectsProcessor.validateID(id, {state});

            const validationResult = subjectsProcessor.validateSubject(req);
            if (validationResult.state != status.ACCEPTED) {
                state = validationResult.state;
                message = validationResult.message;
                throw new Error(message);
            }

            console.log(id);
            let subject = await subjectSchema.findOne({
                attributes: ['name', 'credits', 'level', 'corequisites', 'prerequisites'],
                where: {
                    id
                }
            });
            //console.log(subject);

            if (subject) {
                await subjectSchema.update({
                    name,
                    credits,
                    level,
                    corequisites,
                    prerequisites
                }, {
                    where: {
                        id
                    }
                });

                state = status.OK;
                message = "Subject updated successfully";
                data = { subject };

            } else {
                state = status.NOT_FOUND;
                message = "Not found: Subject not found or does not exist";
                data = {};
            }
        } catch (error) {
            state = state < status.BAD_REQUEST ? status.INTERNAL_SERVER_ERROR : state;
            message = error.message;
            data = error;
        }

        result = {
            state,
            message,
            data
        };
        return result;
    }

    static async setRequisites(req) {
        const { id } = req.params;
        let { append, prerequisites, corequisites } = req.body;
        let result = {};
        let state = status.PROCESSING;
        let message = "";
        let data = {};

        try {
            subjectsProcessor.validateID(id, {state});
            if (!Array.isArray(prerequisites) ||
                !Array.isArray(corequisites)){
                    state = status.NOT_ACCEPTABLE;
                    throw new Error("The requisites must be arrays of integers (ids)");
                }

            const subject = await subjectSchema.findOne({
                attributes: ['id', 'prerequisites', 'corequisites'],
                where: {
                    id
                }
            });

            if (subject) {
                if (append) {
                    if (prerequisites) {
                        subject.prerequisites = [...subject.prerequisites, ...prerequisites];
                    }
                    if (corequisites) {
                        subject.corequisites = [...subject.corequisites, ...corequisites];
                    }
                } else {
                    if (prerequisites) {
                        subject.prerequisites = prerequisites;
                    }
                    if (corequisites) {
                        subject.corequisites = corequisites;
                    }
                }

                await subjectSchema.update({
                    prerequisites: subject.prerequisites,
                    corequisites: subject.corequisites
                }, {
                    where: {
                        id
                    }
                });

                state = status.OK;
                message = "Requisites updated successfully";
                data = { subject };

            } else {
                state = status.NOT_FOUND;
                message = "Not found: Subject not found or does not exist";
                data = {};
            }
        } catch (error) {
            state = state < status.BAD_REQUEST ? status.INTERNAL_SERVER_ERROR : state;
            message = error.message;
            data = error;
        }

        result = {
            state,
            message,
            data
        };
        return result;
    }

    static validateID(id, stateRef) {
        const filteredId = Number.parseInt(id);
            if (!Number.isInteger(filteredId)) {
                stateRef.state = status.NOT_ACCEPTABLE;
                throw new Error(`The id must be an integer (${id})`);
            }
    }
    static validateSubject(req) {
        const { name, credits, level, corequisites, prerequisites } = req.body;
        let result = {
            state: status.PROCESSING,
            message: ""
        };

        const validData = 
            (name && credits && level) &&
            dataProcessor.checkTypes([name, credits, level], ["string", "number", "number"]) == status.ACCEPTED &&
            Array.isArray(corequisites) &&
            Array.isArray(prerequisites);

        if(validData){
            result.state = status.ACCEPTED;
        }
        else {
            result.state = status.NOT_ACCEPTABLE;
            result.message = "Invalid data\n";
            result.message += "The data must follow the following format:\n";
            result.message += `{ \n
                name: "Subject name",\n
                credits: #, (Number of credits)\n
                level: #, (Number of semester)\n
                corequisites: [#, #,.. ,#], (List of corequisites ids)\n
                prerequisites: [#, #,.. ,#] (List of prerequisites ids)\n
            }`;
        }

        return result;
    }
}