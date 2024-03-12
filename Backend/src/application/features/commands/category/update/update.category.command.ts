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

export function makeUpdateCommand({
  categoryService,
  authService,
}: Pick<Dependencies, 'categoryService' | 'authService'>) {
  return async function updateCommand(command: UpdateCommandRequest, res: Response) {
    await validate(command);
    await categoryService.updateCategory(command as RequestCategoryDTO, authService.currentUserId as string);
    return new CustomResponse(null, 'Category updated successful').success(res);
  };
}
