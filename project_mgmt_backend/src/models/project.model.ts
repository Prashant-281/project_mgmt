import mongoose, { Schema, Document } from 'mongoose';

export type ProjectStatus = 'active' | 'completed';

export interface IProject extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: ProjectStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const projectSchema = new Schema<IProject>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
      enum: ['active', 'completed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
