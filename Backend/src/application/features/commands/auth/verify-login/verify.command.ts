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
      .cookie('refreshToken', result.refreshToken, { httpOnly: true, sameSite: 'strict' })
      .header('Authorization', result.accessToken);

    return new CustomResponse({ user: result.user }, 'Login successful').success(res);
  };
}
