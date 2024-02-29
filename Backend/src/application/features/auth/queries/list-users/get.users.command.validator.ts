import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { GetUsersCommandRequest } from './get.users.command';

export async function validate(command: GetUsersCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<GetUsersCommandRequest> = Yup.object().shape({
      pageIndex: Yup.string().min(0).nullable(),
      pageSize: Yup.string().min(0).nullable(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
