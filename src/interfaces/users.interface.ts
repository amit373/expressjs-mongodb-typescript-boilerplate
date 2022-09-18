import { Document } from 'mongoose';
import { UserRoles } from '@app/constants';

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  isActive: boolean;
  role: UserRoles;
  passwordChangedAt: Date;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
  createdAt: Date;
  updatedAt: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  changedPasswordAfter: (timestamp: number) => boolean;
  getResetPasswordToken: () => string;
}
