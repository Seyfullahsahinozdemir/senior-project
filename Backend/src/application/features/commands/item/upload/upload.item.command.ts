import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export function makeUploadCommand({
  imageService,
  imageRepository,
}: Pick<Dependencies, 'imageService' | 'imageRepository'>) {
  return async function uploadCommand(image: Express.Multer.File, res: Response) {
    const uniqueFilename = await imageService.uploadImage(image);
    await imageRepository.create({ filename: uniqueFilename, mimetype: image.mimetype, path: 'local' });

    return new CustomResponse(
      { image: { filename: uniqueFilename, mimetype: image.mimetype } },
      'Image uploaded.',
    ).success(res);
  };
}
