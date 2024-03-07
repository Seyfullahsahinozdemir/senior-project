import { IAuthService, ITokenService } from '@application/interfaces';
import CustomResponse from '@application/interfaces/custom.response';
import { Request, Response, NextFunction } from 'express';

export class AuthenticationMiddleware {
  public readonly tokenService: ITokenService;
  public readonly authService: IAuthService;

  constructor({ tokenService, authService }: { tokenService: ITokenService; authService: IAuthService }) {
    this.tokenService = tokenService;
    this.authService = authService;
  }

  authenticateForAdmin = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers['authorization'] as string;
    const refreshToken = req.cookies['refreshToken'] as string;

    if (!accessToken && !refreshToken) {
      return new CustomResponse(null, 'Unauthorized').error401(res);
    }

    try {
      const verifyTokenResult = this.tokenService.verifyToken(accessToken);

      if (verifyTokenResult?.isAdmin) {
        req.user = {
          id: verifyTokenResult._id,
          username: verifyTokenResult.username,
          isAdmin: verifyTokenResult.isAdmin,
          email: verifyTokenResult.email,
        };
        this.authService.currentUserId = verifyTokenResult._id;
        next();
      } else {
        return new CustomResponse(null, 'Jwt Expired').error401(res);
      }
    } catch (error) {
      if (!refreshToken) {
        return new CustomResponse(null, 'Unauthorized').error401(res);
      }
      try {
        const decoded = this.tokenService.verifyToken(refreshToken);
        if (decoded?.isAdmin) {
          const accessToken = this.tokenService.generateToken(decoded);
          res
            .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
            .header('Authorization', accessToken);

          req.user = {
            id: decoded._id,
            username: decoded.username,
            isAdmin: decoded.isAdmin,
            email: decoded.email,
          };
          this.authService.currentUserId = decoded._id;

          next();
        }
      } catch (error) {
        return new CustomResponse(null, 'Invalid Token').error400(res);
      }
    }
  };

  authenticateForUser = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers['authorization'] as string;
    const refreshToken = req.headers['cookies'] as string;
    if (!accessToken && !refreshToken) {
      return new CustomResponse(null, 'Unauthorized').error401(res);
    }

    try {
      const verifyTokenResult = this.tokenService.verifyToken(accessToken);

      if (verifyTokenResult) {
        req.user = {
          id: verifyTokenResult._id,
          username: verifyTokenResult.username,
          isAdmin: verifyTokenResult.isAdmin,
          email: verifyTokenResult.email,
        };
        this.authService.currentUserId = verifyTokenResult._id;

        next();
      } else {
        return new CustomResponse(null, 'Jwt Expired').error401(res);
      }
    } catch (error) {
      if (!refreshToken) {
        return new CustomResponse(null, 'Unauthorized').error401(res);
      }
      try {
        const decoded = this.tokenService.verifyToken(refreshToken);
        if (decoded) {
          const accessToken = this.tokenService.generateToken(decoded);
          res
            .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
            .header('Authorization', accessToken);

          req.user = {
            id: decoded._id,
            username: decoded.username,
            isAdmin: decoded.isAdmin,
            email: decoded.email,
          };
          this.authService.currentUserId = decoded._id;

          next();
        }
      } catch (error) {
        return new CustomResponse(null, 'Invalid Token').error400(res);
      }
    }
  };
}
