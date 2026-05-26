import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import projectsRouter from "./projects";
import templatesRouter from "./templates";
import dashboardRouter from "./dashboard";
import communityRouter from "./community";
import paymentsRouter from "./payments";
import localStorageRouter from "./local-storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(projectsRouter);
router.use(templatesRouter);
router.use(dashboardRouter);
router.use(communityRouter);
router.use(paymentsRouter);
router.use(localStorageRouter);
// workspace routes are mounted directly in app.ts

export default router;
