import { emailSend } from '../email.service'; // Replace with the correct path to your email service file
import nodemailer, { SentMessageInfo } from 'nodemailer';

// Mock nodemailer module
jest.mock('nodemailer');

describe('emailSend', () => {
  const mockSendMail = jest.fn();
  const mockTransporter = {
    sendMail: mockSendMail,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock nodemailer.createTransport to return our mock transporter
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
  });

  it('should send an email successfully', async () => {
    // Mock successful email sending
    const mockSentMessageInfo: SentMessageInfo = {
      messageId: 'mockMessageId',
      response: '250 OK',
    };
    mockSendMail.mockImplementationOnce((options, callback) => {
      callback(null, mockSentMessageInfo);
    });

    const to = 'test@example.com';
    const subject = 'Test Subject';
    const text = 'Test Content';

    const result = await emailSend(to, subject, text);

    expect(result).toBe(true);
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to,
        subject,
        text,
      }),
      expect.any(Function),
    );
  });

  it('should handle errors during email sending', async () => {
    // Mock email sending with an error
    const mockError = new Error('Mocked email sending error');
    mockSendMail.mockImplementationOnce((options, callback) => {
      callback(mockError, null);
    });

    const to = 'test@example.com';
    const subject = 'Test Subject';
    const text = 'Test Content';

    await expect(emailSend(to, subject, text)).rejects.toThrowError(mockError);
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to,
        subject,
        text,
      }),
      expect.any(Function),
    );
  });
});
