import { IRouter, NextFunction, Request, Response } from 'express';
import { Dependencies } from '@web/crosscutting/container';

export function userController({ dependencies, router }: { dependencies: Dependencies; router: IRouter }) {
  router.post(
    '/api/v1/user/get-followers',
    dependencies.authenticationMiddleware.authenticateForUser,

    async function getFollowers(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.user.queries.getFollowers(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/user/get-following',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function getFollowing(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.user.queries.getFollowing(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/user/get-users-by-username',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function getUsersByUsername(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.user.queries.getUsersByUsername(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/user/follow',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function follow(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.user.commands.follow(
          { currentUserId: request.user.id, targetUserId: request.body.targetUserId },
          response,
        );
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/user/unFollow',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function unFollow(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.user.commands.unFollow(
          { currentUserId: request.user.id, targetUserId: request.body.targetUserId },
          response,
        );
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/user/update',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function update(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.user.commands.update(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  return router;
}
