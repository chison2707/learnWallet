import express from "express";
const router = express.Router();

import * as controller from "../../controllers/admin/user.controller.js";

router.get('/', controller.index);
router.get('/:userId ', controller.getDetail);
router.patch('/changeStatus/:userId', controller.changeStatus);
router.delete('/deleteUser/:userId', controller.deleteUser);

export const userRouter = router;