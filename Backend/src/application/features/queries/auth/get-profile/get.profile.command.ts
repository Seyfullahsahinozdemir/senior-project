import { Dependencies } from '@infrastructure/di';
import { validate } from './get.profile.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type GetProfileCommandRequest = Readonly<{
  _id: string;
}>;

export function makeGetProfileCommand({ authService }: Pick<Dependencies, 'authService'>) {
  return async function getProfileCommand(command: GetProfileCommandRequest, res: Response) {
    await validate(command);
    const result = await authService.getMyProfile(command._id);
    return new CustomResponse({ user: result }, 'success').success(res);
  };
}
