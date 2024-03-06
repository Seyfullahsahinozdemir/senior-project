import { Dependencies } from '@infrastructure/di';
import { validate } from './verify.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type VerifyForLoginCommandRequest = Readonly<{
  email: string;
  otpCode: string;
}>;

export function makeVerifyForLoginCommand({ authService }: Pick<Dependencies, 'authService'>) {
  return async function verifyForLoginCommand(command: VerifyForLoginCommandRequest, res: Response) {
    await validate(command);
    const result = await authService.verifyForLogin({
      email: command.email,
      otpCode: command.otpCode,
    });

    res
      .header('Authorization', result.accessToken)
      .cookie('refreshToken', result.refreshToken, { httpOnly: true, sameSite: 'strict' });

    return new CustomResponse({ user: result.user }, 'Login successful').success(res);
  };
}
