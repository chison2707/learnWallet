import { userRouter } from "./user.route.js";
import { courseRouter } from "./course.route.js";
import { chapterRouter } from "./chapter.route.js";
import { leassonRouter } from "./leasson.route.js";
import { proposalRouter } from "./proposal.route.js";

import requireAuthAdmnin from "../../middlewares/admin/auth.middleware.js";

const mainV1RoutesAdmin = (app) => {
    const version = "/api/v1/admin";

    app.use(version + '/users', requireAuthAdmnin, userRouter);
    app.use(version + '/courses', requireAuthAdmnin, courseRouter);
    app.use(version + '/chapters', requireAuthAdmnin, chapterRouter);
    app.use(version + '/leassons', requireAuthAdmnin, leassonRouter);
    app.use(version + '/proposals', requireAuthAdmnin, proposalRouter);
}

export default mainV1RoutesAdmin;