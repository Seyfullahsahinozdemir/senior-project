import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { IImageService } from '@application/interfaces';
import { ISearchService } from '@application/interfaces/services/search/ISearchService';
import { IItemRepository } from '@application/persistence';
import { Item } from '@domain/entities';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export class SearchService implements ISearchService {
  private readonly searchEndPoint: string;
  private readonly itemRepository: IItemRepository;
  private readonly imageService: IImageService;

  constructor({ itemRepository, imageService }: { itemRepository: IItemRepository; imageService: IImageService }) {
    this.searchEndPoint = process.env.SEARCH_SERVICE_URL;
    this.itemRepository = itemRepository;
    this.imageService = imageService;
  }

  async get(file: Express.Multer.File, paginatedRequest: PaginatedRequest): Promise<Item[]> {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(file.path));

    const pageIndex = paginatedRequest.pageIndex !== null ? paginatedRequest.pageIndex.toString() : '0';
    const pageSize = paginatedRequest.pageSize !== null ? paginatedRequest.pageSize.toString() : '5';
    const queryParams = new URLSearchParams();
    queryParams.append('pageIndex', pageIndex.toString());
    queryParams.append('pageSize', pageSize.toString());

    const response = await axios.post(
      `${this.searchEndPoint}/find_similar_images?${queryParams.toString()}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      },
    );

    const images: string[] = response.data.similar_images;
    const matchingItems: Item[] = [];

    for (const image of images) {
      let items: Item[] = [];
      items = await this.itemRepository.find({ 'image.fileId': image });
      if (items.length === 0) {
        const fileName = await this.imageService.getImageName(image);
        items = await this.itemRepository.find({ 'image.filename': fileName.split('.')[0] });
      }
      matchingItems.push(...items);
    }

    return matchingItems;
  }

  async delete(fileId: string, mimetype: string): Promise<boolean> {
    const response = await axios.post(`${this.searchEndPoint}/delete_item`, {
      item_name: fileId,
      mimetype,
    });

    if (response.data.success) {
      return true;
    }
    return false;
  }

  async add(file: Express.Multer.File): Promise<boolean> {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(file.path));

    const response = await axios.post(`${this.searchEndPoint}/add_image`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (response.data.success) {
      return true;
    }
    return false;
  }
}
