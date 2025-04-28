import express from 'express';
import { 
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from '../controllers/projectController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Project routes
router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

// Task routes
router.route('/:id/tasks')
  .post(protect, createTask)
  .get(protect, getTasks);

router.route('/:id/tasks/:taskId')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
