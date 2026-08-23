import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivity extends Document {
  action: string;
  message: string;
  taskTitle?: string;
  workspaceName?: string;
  timestamp: Date;
}

const ActivitySchema: Schema = new Schema(
  {
    action: { type: String, required: true },
    message: { type: String, required: true },
    taskTitle: { type: String },
    workspaceName: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const ActivityModel: Model<IActivity> =
  mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default ActivityModel;
