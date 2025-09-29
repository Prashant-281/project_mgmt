import { Request, Response } from 'express';
import Project from '../models/project.model';

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, status } = req.body;
    const userId = (req as any).user._id as string;

    const project = await Project.create({
      title,
      description,
      status,
      user: userId,
    });

    return res.status(201).json({ status: 'success', data: project, message: 'Project created successfully'});
  } catch (err: any) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const projects = await Project.find({ user: userId }).sort('-createdAt');
    return res.status(200).json({ status: 'success', data: projects, message: 'Project fetched successfully ' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const projectId = req.params.id;

    const project = await Project.findOneAndUpdate(
      { _id: projectId, user: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json({ status: 'success', data: project , message:'Project updated successfully '});
  } catch (err: any) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const projectId = req.params.id;

    const project = await Project.findOneAndDelete({ _id: projectId, user: userId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or already deleted' });
    }

    return res.status(200).json({ status: 'success', message: 'Project deleted' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
