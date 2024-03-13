import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { RequestItemDTO } from '@application/dto/item/request.category';
import { Item } from '@domain/entities';

export interface IItemService {
  getItems(request: PaginatedRequest): Promise<Item[]>;
  createItem(request: RequestItemDTO, currentUserId: string): Promise<Item>;
  deleteItem(_id: string, currentUserId: string): Promise<void>;
}
