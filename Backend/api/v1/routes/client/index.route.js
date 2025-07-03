import { userRouter } from "./user.route.js";
import { leassonRouter } from "./leasson.route.js";

import { requireAuth } from "../../middlewares/client/auth.middleware.js";

const mainV1RoutesClient = (app) => {
    const version = "/api/v1";

    app.use(version + '/users', userRouter);
    app.use(version + '/leassons', requireAuth, leassonRouter);
}

export default mainV1RoutesClient;