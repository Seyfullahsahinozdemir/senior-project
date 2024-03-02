import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { UpdateCommandRequest } from './update.category.command';

export async function validate(command: UpdateCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<UpdateCommandRequest> = Yup.object().shape({
      _id: Yup.string().required(),
      name: Yup.string().nullable(),
      description: Yup.string().nullable(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
