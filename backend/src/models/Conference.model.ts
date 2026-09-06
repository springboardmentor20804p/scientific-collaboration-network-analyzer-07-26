import mongoose, { Document, Schema } from 'mongoose';

export interface IConference extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  acronym: string;
  year: number;
  location: string;
  startDate: Date;
  endDate: Date;
  submissionDeadline: Date;
  website?: string;
  topics: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  organizerIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ConferenceSchema = new Schema<IConference>(
  {
    title: { type: String, required: true, trim: true },
    acronym: { type: String, required: true, uppercase: true, trim: true, index: true },
    year: { type: Number, required: true, index: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    submissionDeadline: { type: Date, required: true },
    website: { type: String },
    topics: [{ type: String }],
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
      index: true,
    },
    organizerIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

ConferenceSchema.index({ acronym: 1, year: 1 }, { unique: true });

export const Conference = mongoose.model<IConference>('Conference', ConferenceSchema);
