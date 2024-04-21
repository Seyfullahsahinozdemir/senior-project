import { IRouter, NextFunction, Request, Response } from 'express';
import { Dependencies } from '@web/crosscutting/container';
import multer from 'multer';
import { NotFoundException } from '@application/exceptions';

export function searchController({
  dependencies,
  router,
  upload,
}: {
  dependencies: Dependencies;
  router: IRouter;
  upload: multer.Multer;
}) {
  router.post(
    '/api/v1/search/get',
    dependencies.authenticationMiddleware.authenticateForUser,
    upload.single('image'),
    async function get(request: Request, response: Response, next: NextFunction) {
      try {
        if (!request.file) {
          throw new NotFoundException('No image provided.');
        }
        const pageIndex = request.body.page || '0';
        const result = await dependencies.search.queries.get(request.file, { pageIndex, pageSize: '5' }, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  return router;
}
