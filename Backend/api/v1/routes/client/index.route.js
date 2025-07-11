import { userRouter } from "./user.route.js";
import { leassonRouter } from "./leasson.route.js";
import { parentRouter } from "./parent.route.js";
import { courseRouter } from "./course.route.js";
import { proposalRouter } from "./proposal.route.js";
import { walletRouter } from "./wallet.route.js";

import { requireAuth } from "../../middlewares/client/auth.middleware.js";

const mainV1RoutesClient = (app) => {
    const version = "/api/v1";

    app.use(version + '/users', userRouter);
    app.use(version + '/leassons', requireAuth, leassonRouter);
    app.use(version + '/parents', requireAuth, parentRouter);
    app.use(version + '/courses', requireAuth, courseRouter);
    app.use(version + '/proposals', requireAuth, proposalRouter);
    app.use(version + '/wallets', requireAuth, walletRouter);
}

export default mainV1RoutesClient;