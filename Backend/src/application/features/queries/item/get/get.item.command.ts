import { Dependencies } from '@infrastructure/di';
import { validate } from './get.item.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { PaginatedRequest } from '@application/dto/common/paginated.request';

export type GetItemsCommandRequest = Readonly<{
  pageIndex: any;
  pageSize: any;
}>;

export function makeGetItemsCommand({ itemService }: Pick<Dependencies, 'itemService'>) {
  return async function updateCommand(command: GetItemsCommandRequest, res: Response) {
    await validate(command);
    const items = await itemService.getItems(command as PaginatedRequest);
    return new CustomResponse(items, 'success').success(res);
  };
}
