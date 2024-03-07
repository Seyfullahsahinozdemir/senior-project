import { RequestCategoryDTO } from '@application/dto/category/request.category';
import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { ICategoryService } from '@application/interfaces/services/ICategoryService';
import { ICategoryRepository } from '@application/persistence';
import { Category } from '@domain/entities';

export class CategoryService implements ICategoryService {
  public readonly categoryRepository: ICategoryRepository;

  constructor({ categoryRepository }: { categoryRepository: ICategoryRepository }) {
    this.categoryRepository = categoryRepository;
  }

  async getCategories(request: PaginatedRequest): Promise<Category[]> {
    const pageIndex = request.pageIndex ? parseInt(request.pageIndex) : 0;
    const pageSize = request.pageSize ? parseInt(request.pageSize) : 10;

    const categories = await this.categoryRepository.find({}, pageIndex, pageSize);
    return categories;
  }

  async updateCategory(request: RequestCategoryDTO): Promise<boolean> {
    const categoryId = request._id; // Assuming you have an 'id' property in your RequestCategoryDTO

    const existingCategory = await this.categoryRepository.findOne(categoryId as string);

    if (!existingCategory) {
      throw new Error('Category not found');
    }

    // Update the existing category with the new information
    const updatedCategory = request;

    updatedCategory._id = existingCategory._id?.toString();

    await this.categoryRepository.update(categoryId as string, updatedCategory as Category);
    return true;
  }

  async createCategory(request: RequestCategoryDTO): Promise<Category> {
    const newCategory = new Category(request.name as string, request.description);
    const createdCategory = await this.categoryRepository.create(newCategory);
    return createdCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const deletedCategory = await this.categoryRepository.delete(id);

    if (!deletedCategory) {
      throw new Error('Category not found');
    }

    return true;
  }
}
