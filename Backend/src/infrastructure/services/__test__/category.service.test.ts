import { CategoryService } from '../category.service';
import { RequestCategoryDTO } from '@application/dto/category/request.category';

// Mock ICategoryRepository for testing purposes
const mockCategoryRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
};

describe('CategoryService', () => {
  let categoryService: CategoryService;

  beforeEach(() => {
    categoryService = new CategoryService({ categoryRepository: mockCategoryRepository });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategories', () => {
    it('should return categories', async () => {
      // Mock data for the repository's find method
      const mockCategories = [{ name: 'Category 1' }, { name: 'Category 2' }];
      mockCategoryRepository.find.mockResolvedValue(mockCategories);

      // Mock request
      const mockRequest = { pageIndex: '0', pageSize: '10' };

      const result = await categoryService.getCategories(mockRequest);

      expect(mockCategoryRepository.find).toHaveBeenCalledWith({}, 0, 10);
      expect(result).toEqual(mockCategories);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const mockRequest: RequestCategoryDTO = {
        _id: 'categoryId',
        name: 'Updated Category',
        description: 'Updated description',
      };

      const mockExistingCategory = { _id: 'categoryId', name: 'Existing Category' };
      mockCategoryRepository.findOne.mockResolvedValue(mockExistingCategory);

      const result = await categoryService.updateCategory(mockRequest);

      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith('categoryId');
      expect(mockCategoryRepository.update).toHaveBeenCalledWith('categoryId', {
        _id: 'categoryId',
        name: 'Updated Category',
        description: 'Updated description',
      });
      expect(result).toBe(true);
    });

    it('should throw an error if the category does not exist', async () => {
      const mockRequest: RequestCategoryDTO = {
        _id: 'nonexistentId',
        name: 'Updated Category',
        description: 'Updated description',
      };

      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(categoryService.updateCategory(mockRequest)).rejects.toThrowError('Category not found');
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const mockRequest: RequestCategoryDTO = {
        name: 'New Category',
        description: 'New description',
      };

      const mockCreatedCategory = { _id: 'newCategoryId', ...mockRequest };
      mockCategoryRepository.create.mockResolvedValue(mockCreatedCategory);

      const result = await categoryService.createCategory(mockRequest);

      expect(mockCategoryRepository.create).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual(mockCreatedCategory);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const mockCategoryId = 'categoryId';

      const mockDeletedCategory = { _id: mockCategoryId, name: 'Deleted Category' };
      mockCategoryRepository.delete.mockResolvedValue(mockDeletedCategory);

      const result = await categoryService.deleteCategory(mockCategoryId);

      expect(mockCategoryRepository.delete).toHaveBeenCalledWith(mockCategoryId);
      expect(result).toBe(true);
    });

    it('should throw an error if the category does not exist', async () => {
      const mockCategoryId = 'nonexistentId';

      mockCategoryRepository.delete.mockResolvedValue(null);

      await expect(categoryService.deleteCategory(mockCategoryId)).rejects.toThrowError('Category not found');
    });
  });
});
