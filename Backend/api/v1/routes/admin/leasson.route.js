import express from "express";
import multer from "multer";
const router = express.Router();

import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware.js";
import * as validate from "../../validates/admin/leason.admin.js";
import * as controller from "../../controllers/admin/lesson.controller.js";
const upload = multer();

router.get('/', controller.index);
router.get('/:leassonId', controller.getDetail);
router.post('/createLesson', upload.single('videoUrl'), uploadCloud.uploadSingle, validate.leasson, controller.createLeasson);
router.patch('/changeStatus/:leassonId', controller.changeStatus);
router.patch('/editLeasson/:leassonId', upload.single('videoUrl'), uploadCloud.uploadSingle, validate.leassonEdit, controller.editLeasson);
router.delete('/deleteLeason/:leassonId', controller.deleteLeasson);

export const leassonRouter = router;