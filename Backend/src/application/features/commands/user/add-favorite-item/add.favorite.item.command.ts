import { Dependencies } from '@infrastructure/di';
import { validate } from './add.favorite.item.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type AddFavoriteItemCommandRequest = Readonly<{
  itemId: string;
}>;

export function makeAddFavoriteItemCommand({ userService }: Pick<Dependencies, 'userService'>) {
  return async function addFavoriteItemCommand(command: AddFavoriteItemCommandRequest, res: Response) {
    await validate(command);
    await userService.addFavoriteItem(command.itemId);
    return new CustomResponse(null, 'Item successful added to favorite list.').success(res);
  };
}
