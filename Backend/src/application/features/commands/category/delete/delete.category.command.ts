import { Dependencies } from '@infrastructure/di';
import { validate } from './delete.category.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type DeleteCommandRequest = Readonly<{
  _id: string;
}>;

export function makeDeleteCommand({
  categoryService,
  authService,
}: Pick<Dependencies, 'categoryService' | 'authService'>) {
  return async function deleteCommand(command: DeleteCommandRequest, res: Response) {
    await validate(command);
    await categoryService.deleteCategory(command._id, authService.currentUserId as string);
    return new CustomResponse(null, 'Category deleted successful').success(res);
  };
}
