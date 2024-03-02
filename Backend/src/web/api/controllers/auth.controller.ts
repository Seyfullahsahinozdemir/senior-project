import { IRouter, NextFunction, Request, Response } from 'express';
import { Dependencies } from '@web/crosscutting/container';

export function authController({ dependencies, router }: { dependencies: Dependencies; router: IRouter }) {
  router.post(
    '/api/v1/auth/register',
    async function register(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.auth.commands.register(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post('/api/v1/auth/login', async function login(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await dependencies.auth.commands.login(request.body, response);
      return result;
    } catch (error) {
      return next(error);
    }
  });

  router.post(
    '/api/v1/auth/verify-login',
    async function verifyForLogin(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.auth.commands.verifyLogin(request.body, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/auth/reset-password',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function resetPassword(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.auth.commands.resetPassword({ _id: request.user.id }, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/auth/verify-reset-password',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function verifyForResetPassword(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.auth.commands.verifyResetPassword(
          { email: request.user.email, otpCode: request.body.otpCode, password: request.body.password },
          response,
        );
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/auth/get-profile',
    dependencies.authenticationMiddleware.authenticateForUser,
    async function getProfile(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.auth.queries.getProfile({ _id: request.user.id }, response);
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    '/api/v1/auth/get-users',
    dependencies.authenticationMiddleware.authenticateForAdmin,
    async function getUsers(request: Request, response: Response, next: NextFunction) {
      try {
        const result = await dependencies.user.queries.getUsers(
          { pageIndex: request.query.pageIndex, pageSize: request.query.pageSize },
          response,
        );
        return result;
      } catch (error) {
        return next(error);
      }
    },
  );

  return router;
}
