import express from "express";
const router = express.Router();

import * as controller from "../../controllers/client/parent.controller.js";

router.get('/progress/:studentId', controller.getStudentProgress);

export const parentRouter = router;