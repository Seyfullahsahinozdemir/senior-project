import { IRouter, NextFunction, Request, Response } from 'express';
import { Dependencies } from '@web/crosscutting/container';

export function itemController({ dependencies, router }: { dependencies: Dependencies; router: IRouter }) {
  router.post(
    '/api/v1/item/create',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function create(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.item.commands.create(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/item/delete',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function remove(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.item.commands.delete(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.get('/api/v1/item/get', async function get(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await dependencies.item.queries.get(
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
