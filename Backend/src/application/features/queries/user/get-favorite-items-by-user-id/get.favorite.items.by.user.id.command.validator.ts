import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { GetFavoriteItemDTO } from '@application/dto/user/get.favorite.item';
export async function validate(command: GetFavoriteItemDTO) {
  try {
    const schema = Yup.object().shape({
      pageIndex: Yup.number().integer().optional(),
      pageSize: Yup.number().integer().optional(),
      userId: Yup.string().required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
