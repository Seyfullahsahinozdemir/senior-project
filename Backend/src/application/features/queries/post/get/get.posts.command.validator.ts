import * as Yup from 'yup';
import { ValidationException } from '@application/exceptions';
import { PaginatedRequest } from '@application/dto/common/paginated.request';

export async function validate(command: PaginatedRequest) {
  try {
    const schema = Yup.object().shape({
      pageIndex: Yup.number().integer().min(0).optional(),
      pageSize: Yup.number().integer().min(1).max(100).optional(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
