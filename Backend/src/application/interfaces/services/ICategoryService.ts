import { Category } from '@domain/entities';
import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { RequestCategoryDTO } from '@application/dto/category/request.category';

export interface ICategoryService {
  getCategories(request: PaginatedRequest): Promise<Category[]>;
  updateCategory(request: RequestCategoryDTO): Promise<boolean>;
  createCategory(request: RequestCategoryDTO): Promise<Category>;
  deleteCategory(_id: string): Promise<boolean>;
}
