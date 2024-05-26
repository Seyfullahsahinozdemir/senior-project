import { makeUploadCommand } from '../upload.image.command';
import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import { IImageService } from '@application/interfaces';
import { IImageRepository } from '@application/persistence';
import { Readable } from 'stream';

// Mock dependencies
const imageServiceMock: Partial<IImageService> = {
  uploadImage: jest.fn(),
};

const imageRepositoryMock: Partial<IImageRepository> = {
  create: jest.fn(),
};

const dependenciesMock: Pick<Dependencies, 'imageService' | 'imageRepository'> = {
  imageService: imageServiceMock as IImageService,
  imageRepository: imageRepositoryMock as IImageRepository,
};

// Mock Response object
const resMock: Partial<Response> = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

// Mock CustomResponse
jest.mock('@application/interfaces/custom.response', () => ({
  __esModule: true,
  default: class CustomResponseMock {
    constructor(private data: any, private message: string) {}
    success(res: Response) {
      return res.json({ data: this.data, message: this.message, success: true });
    }
  },
}));

describe('makeUploadCommand', () => {
  const uploadCommand = makeUploadCommand(dependenciesMock);

  it('should upload an image successfully', async () => {
    // Mock image file
    const mockImage: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from(''),
      stream: new Readable(), // Mock Readable stream
      destination: '',
      filename: '',
      path: '',
    };

    // Mock unique filename returned by imageService
    const uniqueFilename = {
      fileId: '1234567890',
      fileName: 'unique_test.jpg',
    };
    (imageServiceMock.uploadImage as jest.Mock).mockResolvedValue(uniqueFilename);

    // Execute command
    await uploadCommand(mockImage, resMock as Response);

    // Assertions
    expect(imageServiceMock.uploadImage).toHaveBeenCalledWith(mockImage);
    expect(imageRepositoryMock.create).toHaveBeenCalledWith({
      fileId: uniqueFilename.fileId,
      filename: uniqueFilename.fileName,
      mimetype: mockImage.mimetype,
      path: 'local',
    });
    expect(resMock.json).toHaveBeenCalledWith({
      data: {
        image: {
          filename: uniqueFilename.fileName,
          mimetype: mockImage.mimetype,
          fileId: uniqueFilename.fileId,
        },
      },
      message: 'Image uploaded.',
      success: true,
    });
  });
});
