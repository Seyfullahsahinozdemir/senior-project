import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { Item } from '@domain/entities';

export interface ISearchService {
  get(file: Express.Multer.File, paginatedRequest: PaginatedRequest): Promise<Item[]>;
  delete(fileName: string, mimetype: string): Promise<boolean>;
  add(file: Express.Multer.File): Promise<boolean>;
}
