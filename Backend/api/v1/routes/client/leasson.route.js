import express from "express";
const router = express.Router();

import * as controller from "../../controllers/client/leasson.controller.js";
import * as validate from "../../validates/client/leasson.validate.js";

router.post('/complete/:lessonId', validate.leasson, controller.completeLesson);

export const leassonRouter = router;