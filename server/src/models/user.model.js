const mongoose = require('mongoose');

const ROLES = ['admin', 'staff', 'customer'];

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'customer', index: true },
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.methods.toSafeJSON = function toSafeJSON() {
  const obj = this.toObject({ versionKey: false });
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
module.exports.ROLES = ROLES;
