import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { RequestItemDTO } from '@application/dto/item/request.item';
import { Item } from '@domain/entities';

export interface IItemService {
  getItemsByCurrentUser(request: PaginatedRequest): Promise<Item[]>;
  getItemsByUserId(request: PaginatedRequest, userId: string): Promise<Item[]>;

  createItem(request: RequestItemDTO): Promise<Item>;
  deleteItem(_id: string): Promise<void>;
}
