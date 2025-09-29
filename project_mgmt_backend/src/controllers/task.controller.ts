import { Request, Response } from 'express';
import Task from '../models/task.model';
import Project from '../models/project.model';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const { projectId } = req.params;
    const userId = (req as any).user._id;

    const project = await Project.findOne({ _id: projectId, user: userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      project: projectId,
    });

    return res.status(201).json({ status: 'success', data: task, message: "Task created successfully"});
  } catch (err: any) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { status, page = '1', limit = '10' } = req.query;
    const userId = (req as any).user._id;

    const project = await Project.findOne({ _id: projectId, user: userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    const filter: any = { project: projectId };
    if (status) {
      filter.status = status;
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({ status: "success",
      results: tasks.length,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: tasks , 
      message : 'Tasks for this project fetched successfully'});
  } catch (err: any) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { projectId, taskId } = req.params;
    const userId = (req as any).user._id;

    const project = await Project.findOne({ _id: projectId, user: userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, project: projectId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json({ status: 'success', data: task , message : 'Task updated successfully' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { projectId, taskId } = req.params;
    const userId = (req as any).user._id;

    const project = await Project.findOne({ _id: projectId, user: userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    const task = await Task.findOneAndDelete({ _id: taskId, project: projectId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or already deleted' });
    }

    return res.status(200).json({ status: 'success', message: 'Task deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
