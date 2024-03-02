import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { GetProfileCommandRequest } from './get.profile.command';

export async function validate(command: GetProfileCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<GetProfileCommandRequest> = Yup.object().shape({
      _id: Yup.string().required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
