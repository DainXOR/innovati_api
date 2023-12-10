import { response } from "express";
import studentSchema from "../models/studentSchema";
import subjectSchema from "../models/subjectSchema";

import { dataProcessor } from "./dataProcessor";
import { studentsProcessor } from "./students.dataProcessor";
import { getMultipleSubjects } from "./subjects.controller";
import { subjectsProcessor } from "./subjects.dataProcessor";

const errorMessage = "Student not found";

export async function getStudents(req, res) {
    let response = await studentsProcessor.getAllStudents();
    res.status(response.state);
    res.json(response);
    return;
}
export async function getSingleStudent(req, res) {
    let response = await studentsProcessor.getStudent(req);
    res.status(response.state);
    res.json(response);
    return;
}
export async function getStudentWithSubjects(req, res) {
    let student = await studentsProcessor.getStudent(req);
    let currentSubjects = student.data.current_subjects;
    let completeSubjects = student.data.complete_subjects;

    let subjectsIds = {
        body: {
            ids: []
        }
    };
    for (const [id, _] of Object.entries(currentSubjects)) {
        subjectsIds.body.ids.push(Number.parseInt(id));
    }
    for (const [id, _] of Object.entries(completeSubjects)) {
        subjectsIds.body.ids.push(Number.parseInt(id));
    }

    let subjects = await subjectsProcessor.getSubjectSet(subjectsIds);

    let response = {
        state: Math.max(student.state, subjects.state),
        message: student.message,
        data: {
            student: student,
            subjects: subjects
        }
    };
    res.status(response.state);
    res.json(response);
    return;
}

export async function createStudent(req, res) {
    let response = await studentsProcessor.createStudent(req);
    res.status(response.state);
    res.json(response);
    return;
}

export async function deleteStudent(req, res) {
    let response = await studentsProcessor.deleteStudent(req);
    res.status(response.state);
    res.json(response);
    return;
}

export async function updateStudent(req, res) {
    let response = await studentsProcessor.updateStudent(req);
    res.status(response.state);
    res.json(response);
    return;
}
export async function updateStudentState(req, res) {
    const { document } = req.params;
    const { semester, current_subjects, complete_subjects, active } = req.body;

    try {
        const student = await studentSchema.findOne({
            attributes: ["semester", "current_subjects", "complete_subjects", "active", "updated_at"],
            where: {
                document
            }
        });

        if(student) {
            await studentSchema.update({
                semester,
                current_subjects,
                complete_subjects,
                active,
                updated_at: new Date()
            }, {
                where: {
                    document
                }
            });

            return res.json({
                message: "Success",
                count: 1
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Fail",
            data: {}
        });   
    }
}