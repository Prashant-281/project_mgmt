import express from 'express';
import {
  createTask,
  deleteTask,
  getTasksByProject,
  updateTask,
} from '../controllers/task.controller';
import authorise from '../middlewares/authorise';

const router = express.Router({ mergeParams: true });

router.use(authorise);

// /api/v1/projects/:projectId/tasks
router.post('/', createTask);
router.get('/', getTasksByProject);

// /api/v1/projects/:projectId/tasks/:taskId
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;
