import { Dependencies } from '@infrastructure/di';
import { validate } from './get.items.by.current.user.and.category.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { MimetypeEnum } from '@application/enums/mimetype.enum';

export function makeGetItemsByCurrentUserAndCategoryCommand({
  itemService,
  userRepository,
  imageService,
  authService,
  itemRepository,
}: Pick<Dependencies, 'itemService' | 'userRepository' | 'imageService' | 'authService' | 'itemRepository'>) {
  return async function makeGetItemsByCurrentUserAndCategoryCommand(
    command: { pageSize: string; pageIndex: string; categoryName: string },
    res: Response,
  ) {
    await validate(command);
    const items = await itemService.getItemsByCurrentUserAndCategory(
      { pageIndex: command.pageIndex, pageSize: command.pageSize },
      command.categoryName,
    );

    const updatedItems = [];
    for (const item of items) {
      const user = await userRepository.findOne(item.createdBy as string);

      if (!item.image.fileId) {
        const fileId = await imageService.findFileIdByName(
          (item.image.filename as string) + (item.image.mimetype == MimetypeEnum.JPEG ? '.jpg' : '.png'),
        );
        if (!item.image.public) {
          await imageService.generatePublicUrl(fileId);
          item.image.public = true;
          await itemRepository.update(item._id?.toString() as string, item);
        }
        updatedItems.push({
          _id: item._id,
          urlName: item.urlName,
          description: item.description,
          title: item.title,
          topCategory: item.topCategory,
          subCategories: item.subCategories,
          image: { fileId: fileId, filename: item.image.filename, mimetype: item.image.mimetype },
          createdAt: item.createdAt,
          createdBy: {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          me: item.createdBy === authService.currentUserId ? true : false,
          onFavorite: user.favoriteItems.map(String).includes(item._id?.toString() ?? ''),
        });
      } else {
        if (!item.image.public) {
          await imageService.generatePublicUrl(item.image.fileId);
          item.image.public = true;
          await itemRepository.update(item._id?.toString() as string, item);
        }
        updatedItems.push({
          _id: item._id,
          urlName: item.urlName,
          description: item.description,
          title: item.title,
          topCategory: item.topCategory,
          subCategories: item.subCategories,
          image: item.image,
          createdAt: item.createdAt,
          createdBy: {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          me: item.createdBy === authService.currentUserId ? true : false,
          onFavorite: user.favoriteItems.map(String).includes(item._id?.toString() ?? ''),
        });
      }
    }

    return new CustomResponse(updatedItems, 'success').success(res);
  };
}
