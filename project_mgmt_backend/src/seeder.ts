
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.model";
import Project from "./models/project.model";
import Task from "./models/task.model";
import { DB_URI } from "./config/env";

const MONGO_URI = DB_URI || "";

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for seeding ");

    // Clear existing data for test user only
    const existingUser = await User.findOne({ email: "test@example.com" });

    if (existingUser) {
      const userProjects = await Project.find({ user: existingUser._id });
      const projectIds = userProjects.map((p) => p._id);

      await Task.deleteMany({ project: { $in: projectIds } });
      await Project.deleteMany({ user: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });

      console.log(" Cleared existing test user, projects, and tasks");
    }

    const passwordHash = await bcrypt.hash("Test@123", 12);
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: passwordHash,
    });

    const projects = await Project.insertMany([
      {
        title: "Project Alpha",
        description: "Alpha Desc",
        status: "active",
        user: user._id,
      },
      {
        title: "Project Beta",
        description: "Beta Desc",
        status: "completed",
        user: user._id,
      },
    ]);

    for (const project of projects) {
      await Task.insertMany([
        {
          title: "Task 1",
          description: "Task number 1",
          status: "todo",
          dueDate: new Date(),
          project: project._id,
        },
        {
          title: "Task 2",
          description: "Task number 2",
          status: "in-progress",
          dueDate: new Date(),
          project: project._id,
        },
        {
          title: "Task 3",
          description: "Task number 3",
          status: "done",
          dueDate: new Date(),
          project: project._id,
        },
        {
          title: "Task 4",
          description: "Task number 4",
          status: "todo",
          dueDate: new Date(),
          project: project._id,
        },
        {
          title: "Task 5",
          description: "Task number 5",
          status: "in-progress",
          dueDate: new Date(),
          project: project._id,
        },
        {
          title: "Task 6",
          description: 'Task number 6',
          status: "done",
          dueDate: new Date(),
          project: project._id,
        },
        {
          title: "Task 7",
          description: "Task number 7",
          status: "todo",
          dueDate: new Date(),
          project: project._id,
        },
        {
          title: "Task 8",
          description: "Task number 8",
          status: "in-progress",
          dueDate: new Date(),
          project: project._id,
        },
        {
          title: "Task 9",
          description: "Task number 9",
          status: "done",
          dueDate: new Date(),
          project: project._id,
        },
        {
          title: "Task 10",
          description: "Task number 10",
          status: "todo",
          dueDate: new Date(),
          project: project._id,
        },
        {
          title: "Task 11",
          description: "Task number 11",
          status: "in-progress",
          dueDate: new Date(),
          project: project._id,
        },
        {
          title: "Task 12",
          description: "Task number 12",
          status: "done",
          dueDate: new Date(),
          project: project._id,
        },
        {
          title: "Task 13",
          description: "Task number 13",
          status: "todo",
          dueDate: new Date(),
          project: project._id,
        },
        {
          title: "Task 14",
          description: "Task number 14",
          status: "in-progress",
          dueDate: new Date(),
          project: project._id,
        },
        {
          title: "Task 15",
          description: "Task number 15",
          status: "done",
          dueDate: new Date(),
          project: project._id,
        },
      ]);
    }

    console.log("Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

seed();
