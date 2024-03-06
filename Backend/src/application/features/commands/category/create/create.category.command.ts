import { Dependencies } from '@infrastructure/di';
import { validate } from './create.category.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { RequestCategoryDTO } from '@application/dto/category/request.category';

export type CreateCommandRequest = Readonly<{
  name: string;
  description: any;
}>;

export function makeCreateCommand({ categoryService }: Pick<Dependencies, 'categoryService'>) {
  return async function createCommand(command: CreateCommandRequest, res: Response) {
    await validate(command);
    const category = await categoryService.createCategory(command as RequestCategoryDTO);
    return new CustomResponse(category, 'Category created successful').created(res);
  };
}
