import { Router } from "express";
const router = Router();

import { getStudents, getSingleStudent, getStudentWithSubjects, createStudent, deleteStudent, updateStudent, updateStudentState } from "../controllers/students.controller";

router.get("/", getStudents);
router.get("/:document", getSingleStudent);
router.get("/:document/subjects", getStudentWithSubjects);

router.post("/", createStudent);

router.delete("/:document", deleteStudent);

router.put("/:document", updateStudent);
router.put("/:document/state", updateStudentState);


export default router;
