import { IRouter, NextFunction, Request, Response } from 'express';
import { Dependencies } from '@web/crosscutting/container';

export function postController({ dependencies, router }: { dependencies: Dependencies; router: IRouter }) {
  router.post(
    '/api/v1/post/create',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function create(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.post.commands.create(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/post/delete',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function remove(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.post.commands.delete(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/post/like',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function like(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.post.commands.like(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/post/unlike',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function unlike(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.post.commands.unlike(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/post/comment/create',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function create(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.comment.commands.create(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/post/comment/delete',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function deleteComment(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.comment.commands.delete(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/post/comment/like',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function likeComment(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.comment.commands.like(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/post/comment/unlike',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function unlikeComment(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.comment.commands.unlike(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  return router;
}
