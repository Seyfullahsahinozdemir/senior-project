import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { CreateCommandRequest } from './create.category.command';

export async function validate(command: CreateCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<CreateCommandRequest> = Yup.object().shape({
      _id: Yup.string().required(),
      name: Yup.string().required(),
      description: Yup.string().nullable(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
