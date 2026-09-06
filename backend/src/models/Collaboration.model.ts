import mongoose, { Document, Schema } from 'mongoose';
import { CollaborationStatus } from '../types';

export interface ICollaboration extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  initiatorId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  institutions: mongoose.Types.ObjectId[];
  status: CollaborationStatus;
  researchAreas: string[];
  startDate?: Date;
  endDate?: Date;
  publicationIds: mongoose.Types.ObjectId[];
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CollaborationSchema = new Schema<ICollaboration>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title must be at most 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000, 'Description must be at most 5000 characters'],
    },
    initiatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    institutions: [{ type: Schema.Types.ObjectId, ref: 'Institution' }],
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'rejected'],
      default: 'pending',
    },
    researchAreas: [{ type: String, trim: true }],
    startDate: { type: Date },
    endDate: { type: Date },
    publicationIds: [{ type: Schema.Types.ObjectId, ref: 'Publication' }],
    tags: [{ type: String, lowercase: true, trim: true }],
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CollaborationSchema.index({ title: 'text', description: 'text', tags: 1 });
CollaborationSchema.index({ initiatorId: 1, status: 1 });
CollaborationSchema.index({ members: 1 });
CollaborationSchema.index({ institutions: 1 });

export const Collaboration = mongoose.model<ICollaboration>(
  'Collaboration',
  CollaborationSchema
);
