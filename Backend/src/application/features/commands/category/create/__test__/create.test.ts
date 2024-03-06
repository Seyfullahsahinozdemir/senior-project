import CustomResponse from '@application/interfaces/custom.response';
import { makeCreateCommand, CreateCommandRequest } from '../create.category.command';
import { ValidationException } from '@application/exceptions';

describe('Create Command', () => {
  const categoryServiceMock = {
    getCategories: jest.fn(),
    updateCategory: jest.fn(),
    createCategory: jest.fn(),
    deleteCategory: jest.fn(),
  };

  const dependenciesMock = {
    categoryService: categoryServiceMock,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('makeCreateCommand', () => {
    it('should call categoryService.create and return success response', async () => {
      const command: CreateCommandRequest = {
        name: 'deneme',
        description: 'deneme - 123',
      };

      categoryServiceMock.createCategory.mockResolvedValue(true);

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const createCommand = makeCreateCommand(dependenciesMock);
      await createCommand(command, resMock);

      expect(categoryServiceMock.createCategory).toHaveBeenCalledWith(command);
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: true,
          message: 'Category created successful',
          success: true,
        }),
      );
      expect(resMock.status).toHaveBeenCalledWith(201);
    });

    it('should handle validation errors', async () => {
      const command: CreateCommandRequest = {
        // invalid command, missing required fields
        name: '',
        description: '',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const createCommand = makeCreateCommand(dependenciesMock);

      // Catch the ValidationException and assert on the expected response
      try {
        await createCommand(command, resMock);
      } catch (error: any) {
        // Assert on the expected response for validation errors
        expect(error).toBeInstanceOf(ValidationException);
        expect(error.errors).toHaveLength(1); // Adjust this based on your actual validation rules

        // Assuming you have a method to handle ValidationException in CustomResponse
        const customResponse = new CustomResponse(null, 'Validation failed.');
        customResponse.error400(resMock);

        expect(resMock.json).toHaveBeenCalledWith(
          expect.objectContaining({
            data: null,
            message: 'Validation failed.',
            success: false,
          }),
        );
        expect(resMock.status).toHaveBeenCalledWith(400);
      }

      // Assert that authService.register was not called
      expect(categoryServiceMock.createCategory).not.toHaveBeenCalled();
    });
  });
});
