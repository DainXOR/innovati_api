import { Router } from "express";
const router = Router();

import { 
    createSubject, 
    getSubjects, 
    getSingleSubject, 
    getMultipleSubjects,
    deleteSubject, 
    updateSubject, 
    setRequisites 
} from "../controllers/subjects.controller";

router.get("/", getSubjects);
router.get("/by-ids", getMultipleSubjects);
router.get("/by-ids/:id", getSingleSubject);

router.post("/", createSubject);

router.delete("/:id", deleteSubject);

router.put("/:id", updateSubject);
router.put("/:id/requisites", setRequisites);

export default router;
