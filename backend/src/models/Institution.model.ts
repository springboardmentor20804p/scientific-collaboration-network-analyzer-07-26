import mongoose, { Document, Schema } from 'mongoose';

export interface IInstitution extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  domain: string;          // e.g. "mit.edu"
  country: string;
  type: 'university' | 'research_lab' | 'company' | 'government' | 'ngo';
  website?: string;
  description?: string;
  adminId: mongoose.Types.ObjectId;
  memberCount: number;
  isVerified: boolean;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InstitutionSchema = new Schema<IInstitution>(
  {
    name: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
      maxlength: [200, 'Name must be at most 200 characters'],
    },
    domain: {
      type: String,
      required: [true, 'Email domain is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['university', 'research_lab', 'company', 'government', 'ngo'],
      default: 'university',
    },
    website: { type: String, trim: true },
    description: { type: String, maxlength: 1000 },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    memberCount: { type: Number, default: 0, min: 0 },
    isVerified: { type: Boolean, default: false },
    logoUrl: { type: String },
  },
  { timestamps: true }
);

InstitutionSchema.index({ name: 'text', domain: 1 });

export const Institution = mongoose.model<IInstitution>('Institution', InstitutionSchema);
