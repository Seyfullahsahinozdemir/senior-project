import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { RequestItemDTO } from '@application/dto/item/request.item';
import { NotFoundException } from '@application/exceptions';
import { IAuthService } from '@application/interfaces';
import { IItemService } from '@application/interfaces/services/IItemService';
import { IItemRepository } from '@application/persistence';
import { Item } from '@domain/entities';

export class ItemService implements IItemService {
  private readonly itemRepository: IItemRepository;
  private readonly authService: IAuthService;

  constructor({ itemRepository, authService }: { itemRepository: IItemRepository; authService: IAuthService }) {
    this.itemRepository = itemRepository;
    this.authService = authService;
  }

  async getItems(request: PaginatedRequest): Promise<Item[]> {
    const pageIndex = request.pageIndex ? parseInt(request.pageIndex) : 0;
    const pageSize = request.pageSize ? parseInt(request.pageSize) : 10;
    return await this.itemRepository.find({ createdBy: this.authService.currentUserId }, pageIndex, pageSize);
  }

  async createItem(request: RequestItemDTO): Promise<Item> {
    const newItem = new Item(
      request.urlName,
      request.description,
      request.title,
      request.topCategory,
      request.subCategories,
      request.image,
    );
    newItem.createEntity(this.authService.currentUserId as string);

    return await this.itemRepository.create(newItem);
  }

  async deleteItem(_id: string): Promise<void> {
    const deletedCategory = await this.itemRepository.delete(_id);
    if (!deletedCategory) {
      throw new NotFoundException('Item not found');
    }
    deletedCategory.deleteEntity(this.authService.currentUserId as string);
  }
}
