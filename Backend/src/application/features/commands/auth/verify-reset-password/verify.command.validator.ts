import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { VerifyForResetPasswordCommandRequest } from './verify.command';

export async function validate(command: VerifyForResetPasswordCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<VerifyForResetPasswordCommandRequest> = Yup.object().shape({
      email: Yup.string().email().required(),
      otpCode: Yup.string().length(6).required(),
      password: Yup.string().min(6).required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
