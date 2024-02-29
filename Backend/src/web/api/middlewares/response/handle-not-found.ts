import CustomResponse from '@application/interfaces/custom.response';
import { Request, Response } from 'express';

export function makeHandleNotFound() {
  return function handler(request: Request, response: Response) {
    return new CustomResponse(null, 'Not Found').error404(response);
  };
}
