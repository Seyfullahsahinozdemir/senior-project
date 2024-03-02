import { Dependencies } from '@infrastructure/di';
import { validate } from './reset.password.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type ResetPasswordCommandRequest = Readonly<{
  _id: string;
}>;

export function makeResetPasswordCommand({ authService }: Pick<Dependencies, 'authService'>) {
  return async function resetPasswordCommand(command: ResetPasswordCommandRequest, res: Response) {
    await validate(command);
    const result = await authService.resetPassword(command._id);

    if (!result) {
      return new CustomResponse(result, 'Login unsuccessful').error400(res);
    }

    return new CustomResponse(null, 'Check email for verification.').success(res);
  };
}
