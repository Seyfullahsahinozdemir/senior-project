import { validate } from '../delete.favorite.command.validator';
import { DeleteFavoriteItemCommandRequest } from '../delete.favorite.item.command';
import { ValidationException } from '@application/exceptions';

describe('validate', () => {
  it('should not throw error for valid command', async () => {
    // Mock valid command parameters
    const validCommand: DeleteFavoriteItemCommandRequest = {
      itemId: '123',
    };

    // Execute validation
    await expect(validate(validCommand)).resolves.not.toThrow();
  });

  it('should throw ValidationException for invalid command', async () => {
    // Mock invalid command parameters
    const invalidCommand: DeleteFavoriteItemCommandRequest = {
      itemId: '', // Missing required field
    };

    // Execute validation and catch the error
    await expect(validate(invalidCommand)).rejects.toThrow(ValidationException);
  });

  it('should throw ValidationException with correct error messages', async () => {
    // Mock invalid command parameters
    const invalidCommand: DeleteFavoriteItemCommandRequest = {
      itemId: '', // Missing required field
    };

    // Define expected error messages
    const expectedErrorMessages = ['itemId is a required field'];

    // Execute validation and catch the error
    try {
      await validate(invalidCommand);
    } catch (error: any) {
      // Assertions
      expect(error).toBeInstanceOf(ValidationException);
      expect(error.errors).toHaveLength(expectedErrorMessages.length);
      expectedErrorMessages.forEach((errorMessage) => {
        expect(error.errors).toContain(errorMessage);
      });
    }
  });
});
