import mongoose, { Schema, Document } from 'mongoose';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface ITask extends Document {
  project: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const taskSchema = new Schema<ITask>(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
