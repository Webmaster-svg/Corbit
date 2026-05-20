import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import projectsRouter from "./projects";
import templatesRouter from "./templates";
import dashboardRouter from "./dashboard";
import communityRouter from "./community";
import paymentsRouter from "./payments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(projectsRouter);
router.use(templatesRouter);
router.use(dashboardRouter);
router.use(communityRouter);
router.use(paymentsRouter);

export default router;
