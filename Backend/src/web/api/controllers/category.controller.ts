import { IRouter, NextFunction, Request, Response } from 'express';
import { Dependencies } from '@web/crosscutting/container';

export function categoryController({ dependencies, router }: { dependencies: Dependencies; router: IRouter }) {
  router.post(
    '/api/v1/category/create',
    dependencies.authenticationMiddleware.authenticateForAdmin,

    async function create(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.category.commands.create(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/category/update',
    dependencies.authenticationMiddleware.authenticateForAdmin,

    async function update(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.category.commands.update(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/category/delete',
    dependencies.authenticationMiddleware.authenticateForAdmin,
    async function remove(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.category.commands.delete(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.get('/api/v1/category', async function get(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await dependencies.category.queries.get(
        { pageIndex: request.query.pageIndex, pageSize: request.query.pageSize },
        response,
      );
      return result;
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
