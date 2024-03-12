import { Category } from '@domain/entities';
import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { RequestCategoryDTO } from '@application/dto/category/request.category';

export interface ICategoryService {
  getCategories(request: PaginatedRequest): Promise<Category[]>;
  updateCategory(request: RequestCategoryDTO, currentUserId: string): Promise<boolean>;
  createCategory(request: RequestCategoryDTO, currentUserId: string): Promise<Category>;
  deleteCategory(_id: string, currentUserId: string): Promise<boolean>;
}
