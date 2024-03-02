import { Dependencies } from '@infrastructure/di';
import { validate } from './get.category.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { PaginatedRequest } from '@application/dto/common/paginated.request';

export type GetCategoriesCommandRequest = Readonly<{
  pageIndex: any;
  pageSize: any;
}>;

export function makeGetCategoriesCommand({ categoryService }: Pick<Dependencies, 'categoryService'>) {
  return async function updateCommand(command: GetCategoriesCommandRequest, res: Response) {
    await validate(command);
    const categories = await categoryService.getCategories(command as PaginatedRequest);
    return new CustomResponse(categories, 'success').success(res);
  };
}
