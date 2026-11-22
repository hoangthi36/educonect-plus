import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema(
  {
    phone: { type: String, default: '', maxlength: 100 },
    location: { type: String, default: '', maxlength: 100 },
    headline: { type: String, default: '', maxlength: 160 },
    subjects: { type: [String], default: [] },
    verificationStatus: {
      type: String,
      enum: ['unverified'],
      default: 'unverified',
      immutable: true,
    },
  },
  { _id: false },
)

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    emailNormalized: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, required: true, enum: ['parent', 'tutor', 'admin'], immutable: true },
    accountStatus: {
      type: String,
      enum: ['active', 'disabled'],
      default: 'active',
    },
    profile: { type: profileSchema, default: () => ({}) },
  },
  {
    timestamps: true,
    minimize: false,
  },
)

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
