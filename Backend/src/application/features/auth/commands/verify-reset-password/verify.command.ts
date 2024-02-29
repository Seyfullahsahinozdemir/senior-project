import { Dependencies } from '@infrastructure/di';
import { validate } from './verify.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type VerifyForResetPasswordCommandRequest = Readonly<{
  email: string;
  otpCode: string;
  password: string;
}>;

export function makeVerifyForResetPasswordCommand({ authService }: Pick<Dependencies, 'authService'>) {
  return async function verifyForResetPasswordCommand(command: VerifyForResetPasswordCommandRequest, res: Response) {
    await validate(command);

    const result = await authService.verifyForResetPassword(
      { email: command.email, otpCode: command.otpCode },
      command.password,
    );

    if (!result) {
      return new CustomResponse(result, 'Verification error.').error400(res);
    }

    return new CustomResponse(null, 'Reset password success.').success(res);
  };
}
