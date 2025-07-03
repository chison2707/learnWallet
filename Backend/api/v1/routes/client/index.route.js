import { userRouter } from "./user.route.js";
import { leassonRouter } from "./leasson.route.js";
import { parentRouter } from "./parent.route.js";
import { courseRouter } from "./course.route.js";

import { requireAuth } from "../../middlewares/client/auth.middleware.js";

const mainV1RoutesClient = (app) => {
    const version = "/api/v1";

    app.use(version + '/users', userRouter);
    app.use(version + '/leassons', requireAuth, leassonRouter);
    app.use(version + '/parents', requireAuth, parentRouter);
    app.use(version + '/courses', requireAuth, courseRouter);
}

export default mainV1RoutesClient;