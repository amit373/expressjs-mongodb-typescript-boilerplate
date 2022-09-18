import { NextFunction } from 'express';
import { model, Schema, Document } from 'mongoose';

import { IUser } from '@app/interfaces';
import { UserRoles } from '@app/constants';
import { toInteger } from '@app/utils';
import { bcryptService } from '@app/services';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'FirstName is Required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'LastName is Required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is Required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
      minlength: 8,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: [UserRoles.ADMIN, UserRoles.USER],
      default: UserRoles.USER,
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);

// Encrypt password using bcrypt
userSchema.pre<IUser>('save', async function (next: NextFunction) {
  if (!this.isModified('password')) return next();
  this.password = await bcryptService.hashPassword(this.password);
  return next();
});

// Compare password using bcrypt
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  const isMatch: boolean = await bcryptService.comparePassword(enteredPassword, this.password);
  return isMatch;
};

// Check password is changed or not.
userSchema.pre('save', function (next: NextFunction) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  return next();
});

// If password changed throw error
userSchema.methods.changedPasswordAfter = function (timestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp: number = toInteger(this.passwordChangedAt.getTime() / 1000);
    return timestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  const { resetToken, resetPasswordExpire, resetPasswordToken } = bcryptService.getResetPasswordToken();

  this.resetPasswordToken = resetPasswordToken;
  this.resetPasswordExpire = resetPasswordExpire;
  return resetToken;
};

export const userModel = model<IUser & Document>('User', userSchema);
