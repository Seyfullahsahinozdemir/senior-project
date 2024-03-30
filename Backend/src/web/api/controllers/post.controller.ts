import { IRouter, NextFunction, Request, Response } from 'express';
import { Dependencies } from '@web/crosscutting/container';
import multer from 'multer';
import { NotFoundException } from '@application/exceptions';

export function postController({
  dependencies,
  router,
  upload,
}: {
  dependencies: Dependencies;
  router: IRouter;
  upload: multer.Multer;
}) {
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

  router.post(
    '/api/v1/post/search',
    dependencies.authenticationMiddleware.authenticateForUser,
    upload.single('image'),
    async function search(request: Request, response: Response, next: NextFunction) {
      try {
        if (!request.file) {
          throw new NotFoundException('No image provided.');
        }
        const result = await dependencies.search.queries.get(request.file, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/post/get',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function getPosts(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.post.queries.get(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/post/get-posts-by-user-id',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function getPostsByUserId(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.post.queries.getPostByUserId(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/post/get-posts-by-current-user',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function getPostsByCurrentUser(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.post.queries.getPostByCurrentUser(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  return router;
}
