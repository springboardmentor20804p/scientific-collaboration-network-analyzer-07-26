import mongoose, { Document, Schema } from 'mongoose';

export interface ICitation extends Document {
  _id: mongoose.Types.ObjectId;
  sourcePublicationId: mongoose.Types.ObjectId;
  targetPublicationId: mongoose.Types.ObjectId;
  context?: string;
  createdAt: Date;
}

const CitationSchema = new Schema<ICitation>(
  {
    sourcePublicationId: { type: Schema.Types.ObjectId, ref: 'Publication', required: true, index: true },
    targetPublicationId: { type: Schema.Types.ObjectId, ref: 'Publication', required: true, index: true },
    context: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

CitationSchema.index({ sourcePublicationId: 1, targetPublicationId: 1 }, { unique: true });

export const Citation = mongoose.model<ICitation>('Citation', CitationSchema);
