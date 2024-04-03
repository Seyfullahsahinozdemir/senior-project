import { Dependencies } from '@infrastructure/di';
import { validate } from './delete.favorite.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type DeleteFavoriteItemCommandRequest = Readonly<{
  itemId: string;
}>;

export function makeDeleteFavoriteItemCommand({ userService }: Pick<Dependencies, 'userService'>) {
  return async function deleteFavoriteItemCommand(command: DeleteFavoriteItemCommandRequest, res: Response) {
    await validate(command);
    await userService.deleteFavoriteItem(command.itemId);
    return new CustomResponse(null, 'Item successful removed from favorite list.').success(res);
  };
}
