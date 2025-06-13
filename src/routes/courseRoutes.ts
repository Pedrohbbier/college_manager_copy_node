import express from "express";
import courseController from "../controllers/courseController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../utils/multer";

const router = express.Router();

router.get("/", courseController.listAll);

router.get("/:id", courseController.getById);

router.post("/", upload().any(),  authMiddleware, courseController.create);

router.put("/:id", authMiddleware, courseController.update);

router.delete("/:id", authMiddleware, courseController.remove);

export default router;
