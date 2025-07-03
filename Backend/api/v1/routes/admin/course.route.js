import express from "express";
import multer from "multer";
const router = express.Router();

import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware.js";
import * as validate from "../../validates/admin/course.validate.js";
import * as controller from "../../controllers/admin/course.controller.js";
const upload = multer();

router.get('/', controller.index);
router.get('/:courseId', controller.getDetail);
router.post('/createCourse', upload.single('thumbnail'), uploadCloud.uploadSingle, validate.course, controller.createCourse);
router.patch('/changeStatus/:courseId', controller.changeStatus);
router.patch('/editCourse/:courseId', upload.single('thumbnail'), uploadCloud.uploadSingle, validate.course, controller.editCourse);

export const courseRouter = router;