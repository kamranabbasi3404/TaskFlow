import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITask extends Document {
  userEmail: string;
  workspaceId: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'Done';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    userEmail: { type: String, required: true, index: true, lowercase: true, trim: true },
    workspaceId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Done'],
      default: 'To Do',
      index: true,
    },
    dueDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const TaskModel: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel;
