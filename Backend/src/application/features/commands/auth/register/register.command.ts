import { Dependencies } from '@infrastructure/di';
import { validate } from './register.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type RegisterCommandRequest = Readonly<{
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}>;

export function makeRegisterCommand({ authService }: Pick<Dependencies, 'authService'>) {
  return async function registerCommand(command: RegisterCommandRequest, res: Response) {
    await validate(command);
    const result = await authService.register({
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      username: command.username,
      password: command.password,
    });
    if (!result) {
      return new CustomResponse(null, 'Check fields.').created(res);
    }
    return new CustomResponse(result, 'User created successful').created(res);
  };
}
