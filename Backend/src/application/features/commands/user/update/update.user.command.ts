import { Dependencies } from '@infrastructure/di';
import { validate } from './update.user.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { NotFoundException } from '@application/exceptions';
import { UpdateUserDTO } from '@application/dto/user/update.user';

export function makeUpdateCommand({
  userService,
  imageRepository,
}: Pick<Dependencies, 'userService' | 'imageRepository'>) {
  return async function updateCommand(command: UpdateUserDTO, res: Response) {
    await validate(command);

    const image = await imageRepository.find({ filename: command.preferences.image.filename });
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    const user = await userService.updateUser(command);

    return new CustomResponse({ user }, 'success').success(res);
  };
}
