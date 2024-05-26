import { Response } from 'express';
import { makeGetCategoriesCommand, GetCategoriesCommandRequest } from '../get.category.command';
import { ValidationException } from '@application/exceptions';
import CustomResponse from '@application/interfaces/custom.response';
import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { validate } from '../get.category.command.validator';
import { ICategoryService } from '@application/interfaces';

// Mock dependencies
const categoryServiceMock: Partial<ICategoryService> = {
  getCategories: jest.fn(),
  updateCategory: jest.fn(), // Add other methods to satisfy the interface
  createCategory: jest.fn(),
  deleteCategory: jest.fn(),
};

const dependenciesMock = {
  categoryService: categoryServiceMock as ICategoryService,
};

// Create mock response object
const resMock: Partial<Response> = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

// Mock the validate function
jest.mock('../get.category.command.validator', () => ({
  validate: jest.fn(),
}));

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

describe('getCategoriesCommand', () => {
  const getCategoriesCommand = makeGetCategoriesCommand(dependenciesMock);

  it('should call validate and categoryService.getCategories, then return success response', async () => {
    const command: GetCategoriesCommandRequest = {
      pageIndex: '0',
      pageSize: '10',
    };

    const mockCategories = [
      { _id: '1', name: 'Category 1' },
      { _id: '2', name: 'Category 2' },
    ];

    // Setup mock implementations
    (validate as jest.Mock).mockResolvedValue(undefined);
    (categoryServiceMock.getCategories as jest.Mock).mockResolvedValue(mockCategories);

    // Execute command
    await getCategoriesCommand(command, resMock as Response);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(categoryServiceMock.getCategories).toHaveBeenCalledWith({
      pageIndex: '0',
      pageSize: '10',
    } as PaginatedRequest);

    expect(resMock.json).toHaveBeenCalledWith({
      data: mockCategories.map((category) => ({
        _id: category._id,
        name: category.name,
      })),
      message: 'success',
      success: true,
    });
  });

  it('should handle validation errors', async () => {
    const command: GetCategoriesCommandRequest = {
      pageIndex: 'invalid',
      pageSize: 10,
    };

    const validationError = new ValidationException('Validation error');
    (validate as jest.Mock).mockImplementation(() => {
      throw validationError;
    });

    // Execute command and catch error
    await expect(getCategoriesCommand(command, resMock as Response)).rejects.toThrow(ValidationException);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(categoryServiceMock.getCategories).not.toHaveBeenCalled();

    const customResponse = new CustomResponse(null, 'Validation failed.');
    customResponse.error400(resMock as Response);

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
  });

  it('should handle categoryService.getCategories errors', async () => {
    const command: GetCategoriesCommandRequest = {
      pageIndex: '0',
      pageSize: '10',
    };

    const serviceError = new Error('Service error');
    (validate as jest.Mock).mockResolvedValue(undefined);
    (categoryServiceMock.getCategories as jest.Mock).mockRejectedValue(serviceError);

    // Execute command and catch error
    await expect(getCategoriesCommand(command, resMock as Response)).rejects.toThrow(serviceError);

    // Assertions
    expect(validate).toHaveBeenCalledWith(command);
    expect(categoryServiceMock.getCategories).toHaveBeenCalledWith({
      pageIndex: '0',
      pageSize: '10',
    } as PaginatedRequest);
  });
});
