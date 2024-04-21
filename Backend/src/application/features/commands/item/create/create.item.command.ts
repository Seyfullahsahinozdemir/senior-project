import { Dependencies } from '@infrastructure/di';
import { validate } from './create.item.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { CategoryTypeEnum } from '@application/enums/category.type.enum';
import { NotFoundException } from '@application/exceptions';

export type CreateCommandRequest = Readonly<{
  urlName: string;
  description: string | null;
  title: string;
  topCategory: string;
  subCategories: string[] | null;
  image: { fileId: string; filename: string; mimetype: string };
}>;

export function makeCreateCommand({
  itemService,
  categoryRepository,
  imageRepository,
  imageService,
  searchService,
}: Pick<Dependencies, 'itemService' | 'categoryRepository' | 'imageRepository' | 'imageService' | 'searchService'>) {
  return async function createCommand(command: CreateCommandRequest, res: Response) {
    await validate(command);

    const categories = await categoryRepository.find({ name: command.topCategory, description: CategoryTypeEnum.TOP });
    if (categories.length == 0) {
      throw new NotFoundException('Given top-category not found');
    }

    let image;
    image = await imageRepository.find({ fileId: command.image.fileId });
    if (image.length === 0) {
      image = await imageRepository.find({ filename: command.image.filename });
    }
    if (image.length === 0) {
      throw new NotFoundException('Image not found');
    }

    const imageBuffer = await imageService.getImage(image[0].fileId);

    const response = await searchService.add(imageBuffer);
    if (!response) {
      throw new Error('An error occurred while adding item to model.');
    }

    const item = await itemService.createItem({
      urlName: command.urlName,
      description: command.description,
      title: command.title,
      topCategory: command.topCategory,
      subCategories: command.subCategories,
      image: { fileId: command.image.fileId, filename: command.image.filename, mimetype: command.image.mimetype },
    });
    return new CustomResponse(item, 'Item created successful').created(res);
  };
}
