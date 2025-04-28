import asyncHandler from 'express-async-handler';
import Project from '../models/projectModel.js';
import Task from '../models/taskModel.js';

 
export const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

   const projectCount = await Project.countDocuments({ user: req.user._id });

  if (projectCount >= 4) {
    res.status(400);
    throw new Error('You can have a maximum of 4 projects');
  }

   const project = await Project.create({
    name,
    description,
    user: req.user._id,
  });

  if (project) {
    res.status(201).json(project);
  } else {
    res.status(400);
    throw new Error('Invalid project data');
  }
});

 
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('tasks');

  res.json(projects);
});
 
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('tasks');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

   if (project.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this project');
  }

  res.json(project);
});

 
export const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

   if (project.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this project');
  }

   project.name = name || project.name;
  project.description = description || project.description;

  const updatedProject = await project.save();
  res.json(updatedProject);
});

 
export const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
  
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
  
     if (project.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this project');
    }
  
     await Task.deleteMany({ project: req.params.id });
  
  
    await project.deleteOne(); 
    res.json({ message: 'Project removed' });
  });
 
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const projectId = req.params.id;

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

   if (project.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to add tasks to this project');
  }

   const task = await Task.create({
    title,
    description,
    status,
    project: projectId,
    user: req.user._id,
  });

  if (task) {
     project.tasks.push(task._id);
    await project.save();

    res.status(201).json(task);
  } else {
    res.status(400);
    throw new Error('Invalid task data');
  }
});


export const getTasks = asyncHandler(async (req, res) => {
  const projectId = req.params.id;

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

   if (project.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view tasks in this project');
  }

   const tasks = await Task.find({ project: projectId }).sort({ createdAt: -1 });
  res.json(tasks);
});

 
export const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const { id: projectId, taskId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
 
  if (project.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update tasks in this project');
  }
 
  const task = await Task.findById(taskId);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
 
  task.title = title || task.title;
  task.description = description || task.description;
  if (status) task.status = status;

  const updatedTask = await task.save();
  res.json(updatedTask);
});

 
export const deleteTask = asyncHandler(async (req, res) => {
  const { id: projectId, taskId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

   
  if (project.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete tasks in this project');
  }

 
  const task = await Task.findById(taskId);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  
  project.tasks = project.tasks.filter(
    (t) => t.toString() !== taskId.toString()
  );
  await project.save();

 
  await task.deleteOne();
  res.json({ message: 'Task removed' });
});