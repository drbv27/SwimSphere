// src/models/User.js
import mongoose from 'mongoose';

/**
 * User Schema: Represents a user in the application.
 * - name: Full name of the user.
 * - email: Unique email address for login.
 * - role: Defines the user's role in the system.
 * - password: Hashed password (never stored in plain text).
 * - birthdate: User's date of birth.
 */
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['swimmer', 'trainer', 'admin', 'father'], required: true },
    password: { type: String, required: true, select: false }, // Exclude password by default
    birthdate: { type: Date, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: Calculate user's age dynamically
UserSchema.virtual('age').get(function () {
  const today = new Date();
  const birthDate = new Date(this.birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
