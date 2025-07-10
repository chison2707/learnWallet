import express from "express";
const router = express.Router();

import * as controller from "../../controllers/client/course.controller.js";

router.get('/', controller.getCourses);
router.get('/:courseId', controller.getChapters);
router.get('/chapter/:chapterId', controller.getLessons);

export const courseRouter = router;