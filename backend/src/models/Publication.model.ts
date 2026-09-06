import mongoose, { Document, Schema } from 'mongoose';
import { PublicationStatus } from '../types';

export interface IPublication extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  abstract: string;
  authors: mongoose.Types.ObjectId[];      // Users
  correspondingAuthor: mongoose.Types.ObjectId;
  collaborationId?: mongoose.Types.ObjectId;
  institutionIds: mongoose.Types.ObjectId[];
  keywords: string[];
  researchArea: string;
  status: PublicationStatus;
  submittedAt?: Date;
  publishedAt?: Date;
  journal?: string;
  doi?: string;
  fileUrl?: string;
  reviewIds: mongoose.Types.ObjectId[];
  citationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PublicationSchema = new Schema<IPublication>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [500, 'Title must be at most 500 characters'],
    },
    abstract: {
      type: String,
      required: [true, 'Abstract is required'],
      maxlength: [5000, 'Abstract must be at most 5000 characters'],
    },
    authors: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    correspondingAuthor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborationId: { type: Schema.Types.ObjectId, ref: 'Collaboration' },
    institutionIds: [{ type: Schema.Types.ObjectId, ref: 'Institution' }],
    keywords: [{ type: String, lowercase: true, trim: true }],
    researchArea: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'accepted', 'published', 'rejected'],
      default: 'draft',
    },
    submittedAt: { type: Date },
    publishedAt: { type: Date },
    journal: { type: String, trim: true },
    doi: { type: String, unique: true, sparse: true },
    fileUrl: { type: String },
    reviewIds: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    citationCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

PublicationSchema.index({ title: 'text', abstract: 'text', keywords: 1 });
PublicationSchema.index({ authors: 1, status: 1 });
PublicationSchema.index({ researchArea: 1 });
PublicationSchema.index({ doi: 1 });

export const Publication = mongoose.model<IPublication>(
  'Publication',
  PublicationSchema
);
