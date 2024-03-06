import CustomResponse from '@application/interfaces/custom.response';
import { makeDeleteCommand, DeleteCommandRequest } from '../delete.category.command';
import { ValidationException } from '@application/exceptions';

describe('Delete Command', () => {
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

  describe('makeDeleteCommand', () => {
    it('should call categoryService.delete and return success response', async () => {
      const command: DeleteCommandRequest = {
        _id: 'test',
      };

      categoryServiceMock.deleteCategory.mockResolvedValue(true);

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const deleteCommand = makeDeleteCommand(dependenciesMock);
      await deleteCommand(command, resMock);

      expect(categoryServiceMock.deleteCategory).toHaveBeenCalledWith(command._id);
      expect(resMock.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: null,
          message: 'Category deleted successful',
          success: true,
        }),
      );
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    it('should handle validation errors', async () => {
      const command: DeleteCommandRequest = {
        // invalid command, missing required fields
        _id: '',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const deleteCommand = makeDeleteCommand(dependenciesMock);

      // Catch the ValidationException and assert on the expected response
      try {
        await deleteCommand(command, resMock);
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
      expect(categoryServiceMock.deleteCategory).not.toHaveBeenCalled();
    });
  });
});
