import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { GetItemsCommandRequest } from './get.item.command';

export async function validate(command: GetItemsCommandRequest) {
  try {
    const schema: Yup.ObjectSchema<GetItemsCommandRequest> = Yup.object().shape({
      pageIndex: Yup.string().min(0).nullable(),
      pageSize: Yup.string().min(0).nullable(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
