import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { ResetPasswordCommandRequest } from './reset.password.command';

export async function validate(command: ResetPasswordCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<ResetPasswordCommandRequest> = Yup.object().shape({
      _id: Yup.string().required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
