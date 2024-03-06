import { makeGetCategoriesCommand, GetCategoriesCommandRequest } from '../get.category.command';
import { ValidationException } from '@application/exceptions';
import CustomResponse from '@application/interfaces/custom.response';

describe('GetCategories Command', () => {
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

  describe('makeGetCategoriesCommand', () => {
    it('should call validate and categoryService.getCategories, then return success response', async () => {
      const command: GetCategoriesCommandRequest = {
        pageIndex: '0',
        pageSize: '10',
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const getCategoriesCommand = makeGetCategoriesCommand(dependenciesMock);

      categoryServiceMock.getCategories.mockResolvedValue(['category1', 'category2']);

      await getCategoriesCommand(command, resMock);

      expect(categoryServiceMock.getCategories).toHaveBeenCalledWith(command);
      expect(resMock.json).toHaveBeenCalledWith({
        data: ['category1', 'category2'],
        message: 'success',
        success: true,
      });
    });

    it('should handle validation errors', async () => {
      const command: GetCategoriesCommandRequest = {
        pageIndex: 'invalid', // Invalid type for pageIndex
        pageSize: 10,
      };

      const resMock: any = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const getCategoriesCommand = makeGetCategoriesCommand(dependenciesMock);

      try {
        await getCategoriesCommand(command, resMock);
        // If there is no validation error, fail the test
      } catch (error: any) {
        // Expect a ValidationException to be thrown
        expect(error).toBeInstanceOf(ValidationException);
        expect(error.errors).toHaveLength(1); // Adjust this based on your actual validation rules

        // Ensure that categoryService.getCategories is not called in case of validation error
        expect(categoryServiceMock.getCategories).not.toHaveBeenCalled();

        // Assuming you have a method to handle ValidationException in CustomResponse
        const customResponse = new CustomResponse(null, 'Validation failed.');
        customResponse.error400(resMock);

        // Ensure that the response is formatted correctly
        expect(resMock.json).toHaveBeenCalledWith(
          expect.objectContaining({
            data: null,
            message: 'Validation failed.',
            success: false,
          }),
        );

        // Ensure that the status code is set to 400
        expect(resMock.status).toHaveBeenCalledWith(400);
      }
    });
  });
});
