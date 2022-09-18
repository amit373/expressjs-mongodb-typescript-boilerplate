import { compare, genSalt, hash } from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { generateOtp } from '@app/utils';

export class BcryptService {
  async hashPassword(password: string): Promise<string> {
    const salt: string = await genSalt(10);
    const hashedPassword: string = await hash(password, salt);
    return hashedPassword;
  }

  async comparePassword(enteredPassword: string, originalPassword: string): Promise<boolean> {
    const isMatch: boolean = await compare(enteredPassword, originalPassword);
    return isMatch;
  }

  getResetPasswordToken(
    minutes = 10,
    isOtp = false,
  ): {
    resetToken: string;
    resetPasswordToken?: string;
    resetPasswordExpire: Date;
  } {
    let resetToken = '';
    // Set expire 10 mins
    const resetPasswordExpire: Date = new Date(Date.now() + minutes * 60 * 1000);
    if (isOtp) {
      return {
        resetToken: generateOtp(6),
        resetPasswordExpire,
      };
    }
    // Generate token
    resetToken = randomBytes(16).toString('hex');

    // Hash token and set to resetPasswordToken field
    const resetPasswordToken: string = createHash('sha256').update(resetToken).digest('hex');

    return {
      resetToken,
      resetPasswordToken,
      resetPasswordExpire,
    };
  }

  updateResetToken(resetToken: string): string {
    const resetPasswordToken: string = createHash('sha256').update(resetToken).digest('hex');
    return resetPasswordToken;
  }
}

export const bcryptService = new BcryptService();
