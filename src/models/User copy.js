//src/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['swimmer', 'trainer', 'admin', 'father'], required: true },
    password: { type: String, required: true },
    birthdate: { type: Date, required: true }, // Store birthdate
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }); // Enable virtuals in JSON responses

// Calculate age dynamically
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
