import express from 'express';
import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
} from '../controllers/project.controller';
import authorise from '../middlewares/authorise';
import taskRoutes from './task.routes';
const router = express.Router();

router.use(authorise);
//api/v1/projects/...
router.post('/', createProject);
router.get('/', getAllProjects);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.use('/:projectId/tasks', taskRoutes);
export default router;
