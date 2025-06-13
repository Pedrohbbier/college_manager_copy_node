import { Router, json, urlencoded, static as static_ } from "express";
import authRouter from "./authRoutes";
import coursesRouter from "./courseRoutes";
import { join } from "path";

const mainRouter = Router();

mainRouter.use("/uploads", static_(join(__dirname, "../uploads")));

mainRouter.use(json());
mainRouter.use(urlencoded({ extended: true }));

mainRouter.use("/api/auth", authRouter);

mainRouter.use("api/courses" , coursesRouter)

export { mainRouter };