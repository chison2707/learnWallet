import express from "express";
import multer from "multer";
const router = express.Router();

import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware.js";
import * as validate from "../../validates/admin/course.validate.js";
import * as controller from "../../controllers/admin/course.controller.js";
const upload = multer();

// router.get('/', controller.index);
router.post('/createCourse', upload.single('thumbnail'), uploadCloud.uploadSingle, validate.course, controller.createCourse);
// router.delete('/deleteUser/:userId', controller.deleteUser);

export const courseRouter = router;