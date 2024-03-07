import { otpGenerate } from '../otp.service'; // Replace with the correct path to your OTP service file

describe('otpGenerate', () => {
  it('should generate a valid OTP code and expiration time', () => {
    // Mock the current date to a fixed value for testing
    const currentDate = new Date('2024-03-01T12:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => currentDate);

    const result = otpGenerate();

    // Assert that the generated OTP code is a string of 6 characters
    expect(result.otp).toHaveLength(6);
    expect(typeof result.otp).toBe('string');

    // Assert that the expiration time is set to 30 minutes from the current date
    const expectedExpirationTime = new Date(currentDate.getTime() + 30 * 60000);
    expect(result.expirationTime).toEqual(expectedExpirationTime);

    // Restore the original implementation of the Date object
    jest.restoreAllMocks();
  });
});
