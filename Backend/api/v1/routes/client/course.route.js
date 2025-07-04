import express from "express";
const router = express.Router();

import * as controller from "../../controllers/client/course.controller.js";

router.get('/', controller.getCourses);
router.get('/chapters/:courseId', controller.getChapters);
router.get('/lessons/:chapterId', controller.getLessons);

export const courseRouter = router;