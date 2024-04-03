import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { DeleteFavoriteItemCommandRequest } from './delete.favorite.item.command';

export async function validate(command: DeleteFavoriteItemCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<DeleteFavoriteItemCommandRequest> = Yup.object().shape({
      itemId: Yup.string().required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
