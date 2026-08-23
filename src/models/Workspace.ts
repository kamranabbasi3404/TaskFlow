import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkspace extends Document {
  userEmail: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceSchema: Schema = new Schema(
  {
    userEmail: { type: String, required: true, index: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    color: { type: String, default: '#6366f1' },
    description: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const WorkspaceModel: Model<IWorkspace> =
  mongoose.models.Workspace || mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);

export default WorkspaceModel;
