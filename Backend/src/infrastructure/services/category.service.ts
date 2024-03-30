import { RequestCategoryDTO } from '@application/dto/category/request.category';
import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { CategoryTypeEnum } from '@application/enums/category.type.enum';
import { IAuthService } from '@application/interfaces';
import { ICategoryService } from '@application/interfaces/services/ICategoryService';
import { ICategoryRepository } from '@application/persistence';
import { Category } from '@domain/entities';

export class CategoryService implements ICategoryService {
  public readonly categoryRepository: ICategoryRepository;
  private readonly authService: IAuthService;

  constructor({
    categoryRepository,
    authService,
  }: {
    categoryRepository: ICategoryRepository;
    authService: IAuthService;
  }) {
    this.categoryRepository = categoryRepository;
    this.authService = authService;
  }

  async getCategories(request: PaginatedRequest): Promise<Category[]> {
    const pageIndex = request.pageIndex ? parseInt(request.pageIndex) : 0;
    const pageSize = request.pageSize ? parseInt(request.pageSize) : 10;

    const categories = await this.categoryRepository.find({ description: CategoryTypeEnum.TOP }, pageIndex, pageSize);
    return categories;
  }

  async updateCategory(request: RequestCategoryDTO): Promise<boolean> {
    const categoryId = request._id;

    const existingCategory = await this.categoryRepository.findOne(categoryId as string);

    if (!existingCategory) {
      throw new Error('Category not found');
    }

    existingCategory.name = request.name ? request.name : existingCategory.name;
    existingCategory.description = request.description ? request.description : existingCategory.description;
    existingCategory.updateEntity(this.authService.currentUserId as string);

    await this.categoryRepository.update(categoryId as string, existingCategory);
    return true;
  }

  async createCategory(request: RequestCategoryDTO): Promise<Category> {
    const newCategory = new Category(request.name as string, request.description);
    newCategory.createEntity(this.authService.currentUserId as string);
    const createdCategory = await this.categoryRepository.create(newCategory);
    return createdCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const deletedCategory = await this.categoryRepository.delete(id);
    if (!deletedCategory) {
      throw new Error('Category not found');
    }

    deletedCategory.deleteEntity(this.authService.currentUserId as string);

    return true;
  }
}
