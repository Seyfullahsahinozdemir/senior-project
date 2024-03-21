import { Dependencies } from '@infrastructure/di';
import { validate } from './update.category.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { RequestCategoryDTO } from '@application/dto/category/request.category';

export type UpdateCommandRequest = Readonly<{
  _id: string;
  name: any;
  description: any;
}>;

export function makeUpdateCommand({ categoryService }: Pick<Dependencies, 'categoryService'>) {
  return async function updateCommand(command: UpdateCommandRequest, res: Response) {
    await validate(command);
    await categoryService.updateCategory(command as RequestCategoryDTO);
    return new CustomResponse(null, 'Category updated successful').success(res);
  };
}
