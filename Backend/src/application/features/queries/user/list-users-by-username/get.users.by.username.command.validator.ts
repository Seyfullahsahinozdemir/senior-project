import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { GetUsersByUsernameCommandRequest } from './get.users.by.username.command';

export async function validate(command: GetUsersByUsernameCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<GetUsersByUsernameCommandRequest> = Yup.object().shape({
      pageIndex: Yup.string().min(0).nullable(),
      pageSize: Yup.string().min(0).nullable(),
      key: Yup.string().required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
