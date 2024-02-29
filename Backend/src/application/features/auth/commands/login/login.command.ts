import { Dependencies } from '@infrastructure/di';
import { validate } from './login.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type LoginCommandRequest = Readonly<{
  usernameOrEmail: string;
  password: string;
}>;

export function makeLoginCommand({ authService }: Pick<Dependencies, 'authService'>) {
  return async function loginCommand(command: LoginCommandRequest, res: Response) {
    await validate(command);
    const result = await authService.login({
      usernameOrEmail: command.usernameOrEmail,
      password: command.password,
    });

    if (!result) {
      return new CustomResponse(result, 'Login unsuccessful').error400(res);
    }

    return new CustomResponse(null, 'Check email for verification.').success(res);
  };
}
