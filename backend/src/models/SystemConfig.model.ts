import mongoose, { Document, Schema } from 'mongoose';

export interface ISystemConfig extends Document {
  _id: mongoose.Types.ObjectId;
  key: string;
  value: any;
  category: 'general' | 'security' | 'email' | 'features';
  description?: string;
  isSecret?: boolean;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SystemConfigSchema = new Schema<ISystemConfig>(
  {
    key: { type: String, required: true, unique: true, uppercase: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
    category: {
      type: String,
      enum: ['general', 'security', 'email', 'features'],
      default: 'general',
      index: true,
    },
    description: { type: String },
    isSecret: { type: Boolean, default: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const SystemConfig = mongoose.model<ISystemConfig>('SystemConfig', SystemConfigSchema);
