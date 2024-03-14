import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { RequestItemDTO } from '@application/dto/item/request.item';
import { NotFoundException } from '@application/exceptions';
import { IItemService } from '@application/interfaces/services/IItemService';
import { IItemRepository } from '@application/persistence';
import { Item } from '@domain/entities';

export class ItemService implements IItemService {
  public readonly itemRepository: IItemRepository;

  constructor({ itemRepository }: { itemRepository: IItemRepository }) {
    this.itemRepository = itemRepository;
  }

  async getItems(request: PaginatedRequest): Promise<Item[]> {
    const pageIndex = request.pageIndex ? parseInt(request.pageIndex) : 0;
    const pageSize = request.pageSize ? parseInt(request.pageSize) : 10;
    return await this.itemRepository.find({}, pageIndex, pageSize);
  }

  async createItem(request: RequestItemDTO, currentUserId: string): Promise<Item> {
    const newItem = new Item(
      request.urlName,
      request.description,
      request.title,
      request.topCategory,
      request.subCategories,
      request.image,
    );
    newItem.create(currentUserId);

    return await this.itemRepository.create(newItem);
  }

  async deleteItem(_id: string, currentUserId: string): Promise<void> {
    const deletedCategory = await this.itemRepository.delete(_id);
    if (!deletedCategory) {
      throw new NotFoundException('Item not found');
    }
    deletedCategory.delete(currentUserId);
  }
}
