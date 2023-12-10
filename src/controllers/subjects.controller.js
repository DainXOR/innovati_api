import subjectSchema from '../models/subjectSchema';
import { subjectsProcessor } from "./subjects.dataProcessor";
import { dataProcessor } from "./dataProcessor";
import { status } from "./error_codes";

const successMessage = 'Success';
const errorMessage = 'Subject not found';

export async function getSubjects(req, res) {
    let response = await subjectsProcessor.getAllSubjects();
    res.status(response.state);
    res.json(response);
    return;
}
export async function getMultipleSubjects(req, res) {
    let response = await subjectsProcessor.getSubjectSet(req);
    res.status(response.state);
    res.json(response);
    return;
}
export async function getSingleSubject(req, res) {
    let response = await subjectsProcessor.getSubject(req);
    res.status(response.state);
    res.json(response);
    return;
}

export async function createSubject(req, res) {
    let response = await subjectsProcessor.createSubject(req);
    res.status(response.state);
    res.json(response);
    return;
}

export async function deleteSubject(req, res) {
    let response = await subjectsProcessor.deleteSubject(req);
    res.status(response.state);
    res.json(response);
    return;
}

export async function updateSubject(req, res) {
    let response = await subjectsProcessor.updateSubject(req);
    res.status(response.state);
    res.json(response);
    return;
}
export async function setRequisites(req, res) {
    let response = await subjectsProcessor.setRequisites(req);
    res.status(response.state);
    res.json(response);
    return;
}
