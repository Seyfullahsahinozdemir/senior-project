import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { RequestItemDTO } from '@application/dto/item/request.item';
import { Item } from '@domain/entities';

export interface IItemService {
  getItems(request: PaginatedRequest): Promise<Item[]>;
  createItem(request: RequestItemDTO): Promise<Item>;
  deleteItem(_id: string): Promise<void>;
}
