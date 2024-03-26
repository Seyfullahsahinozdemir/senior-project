import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { UpdateUserDTO } from '@application/dto/user/update.user';

export async function validate(command: UpdateUserDTO) {
  try {
    const schema = Yup.object().shape({
      firstName: Yup.string().nullable(),
      lastName: Yup.string().nullable(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
