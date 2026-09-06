import mongoose, { Document, Schema } from 'mongoose';
import { ReviewDecision } from '../types';

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  publicationId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  decision: ReviewDecision;
  summary: string;
  comments: {
    section: string;
    comment: string;
    severity: 'major' | 'minor' | 'suggestion';
  }[];
  score: number;        // 1–10
  isAnonymous: boolean;
  submittedAt?: Date;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    publicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Publication',
      required: true,
    },
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    decision: {
      type: String,
      enum: ['pending', 'accept', 'minor_revision', 'major_revision', 'reject'],
      default: 'pending',
    },
    summary: {
      type: String,
      maxlength: [3000, 'Summary must be at most 3000 characters'],
      default: '',
    },
    comments: [
      {
        section: { type: String, required: true },
        comment: { type: String, required: true },
        severity: {
          type: String,
          enum: ['major', 'minor', 'suggestion'],
          default: 'minor',
        },
      },
    ],
    score: { type: Number, min: 1, max: 10 },
    isAnonymous: { type: Boolean, default: true },
    submittedAt: { type: Date },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

ReviewSchema.index({ publicationId: 1, reviewerId: 1 }, { unique: true });
ReviewSchema.index({ reviewerId: 1, decision: 1 });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
