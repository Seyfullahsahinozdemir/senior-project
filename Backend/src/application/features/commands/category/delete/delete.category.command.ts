import { Dependencies } from '@infrastructure/di';
import { validate } from './delete.category.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type DeleteCommandRequest = Readonly<{
  _id: string;
}>;

export function makeDeleteCommand({ categoryService }: Pick<Dependencies, 'categoryService'>) {
  return async function deleteCommand(command: DeleteCommandRequest, res: Response) {
    await validate(command);
    await categoryService.deleteCategory(command._id);
    return new CustomResponse(null, 'Category deleted successful').success(res);
  };
}
