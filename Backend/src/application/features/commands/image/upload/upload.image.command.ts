import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export function makeUploadCommand({
  imageService,
  imageRepository,
}: Pick<Dependencies, 'imageService' | 'imageRepository'>) {
  return async function uploadCommand(image: Express.Multer.File, res: Response) {
    const uniqueFilename = await imageService.uploadImage(image);
    await imageRepository.create({
      fileId: uniqueFilename.fileId,
      filename: uniqueFilename.fileName,
      mimetype: image.mimetype,
      path: 'local',
    });

    return new CustomResponse(
      { image: { filename: uniqueFilename.fileName, mimetype: image.mimetype, fileId: uniqueFilename.fileId } },
      'Image uploaded.',
    ).success(res);
  };
}
