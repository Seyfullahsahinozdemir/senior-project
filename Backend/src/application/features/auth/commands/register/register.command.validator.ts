import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { RegisterCommandRequest } from './register.command';

export async function validate(command: RegisterCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<RegisterCommandRequest> = Yup.object().shape({
      firstName: Yup.string().required(),
      lastName: Yup.string().required(),
      username: Yup.string().min(6).required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
