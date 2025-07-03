import express from "express";
const router = express.Router();

import * as validate from "../../validates/admin/chapter.validate.js";
import * as controller from "../../controllers/admin/chapter.controller.js";

router.get('/', controller.index);
router.get('/:chapterId', controller.getDetail);
router.post('/createChapter', validate.chapter, controller.createChapter);
router.patch('/changeStatus/:chapterId', controller.changeStatus);
router.patch('/editChapter/:chapterId', controller.editChapter);
router.delete('/deleteChapter/:chapterId', controller.deleteChapter);

export const chapterRouter = router;