import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { LoginCommandRequest } from './login.command';

export async function validate(command: LoginCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<LoginCommandRequest> = Yup.object().shape({
      usernameOrEmail: Yup.string().min(6).required(),
      password: Yup.string().min(6).required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
