import { IRouter, NextFunction, Request, Response } from 'express';
import { Dependencies } from '@web/crosscutting/container';
import multer from 'multer';
import { NotFoundException } from '@application/exceptions';

export function imageController({
  dependencies,
  router,
  upload,
}: {
  dependencies: Dependencies;
  router: IRouter;
  upload: multer.Multer;
}) {
  router.post(
    '/api/v1/image/upload',
    dependencies.authenticationMiddleware.authenticateForUser,
    upload.single('image'),
    async function create(request: Request, response: Response, next: NextFunction) {
      try {
        if (!request.file) {
          throw new NotFoundException('No image provided.');
        }
        const result = await dependencies.image.commands.upload(request.file, response);
        // const result = await dependencies.image.commands.upload('a', response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  return router;
}
