import express from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
} from "../controllers/project.controller";
import authorise from "../middlewares/authorise";
import taskRoutes from "./task.routes";
import { body } from "express-validator";
const router = express.Router();

router.use(authorise);
//api/v1/projects/...
router.post(
  "/",
  [
    body("title")
      .isLength({ max: 20 })
      .notEmpty()
      .withMessage("The title should not be more than 20 characters"),
    body("name").notEmpty(),
    body("description").notEmpty().withMessage("Title should not be empty"),
  ],
  createProject
);
router.get("/", getAllProjects);
router.put(
  "/:id",
  [
    body("title")
      .notEmpty()
      .isLength({ max: 10 })
      .withMessage("The title should not be more than 20 characters"),
    body("name").notEmpty(),
    body("description").notEmpty().withMessage("Title should not be empty"),
  ],
  updateProject
);
router.delete("/:id", deleteProject);
router.use("/:projectId/tasks", taskRoutes);
export default router;
