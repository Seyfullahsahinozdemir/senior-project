import { asClass, asValue, Resolver } from 'awilix';
import mongoose from 'mongoose';
import * as Interfaces from '@application/interfaces';
import { makeLogger } from './logger';
import { IUserRepository } from '@application/persistence/IUserRepository';
import { UserRepository } from './persistence/repositories/user.repository';
import { AuthService } from './auth/auth.service';
import { TokenService } from './auth/token.service';
import { AuthenticationMiddleware } from './middlewares/authentication.middleware';
import { ICategoryRepository, IOtpRepository } from '@application/persistence';
import { OtpRepository } from './persistence/repositories/otp.repository';
import { CategoryService, UserService } from './services';
import { CategoryRepository } from './persistence';

export type Dependencies = {
  db: mongoose.Connection;
  logger: Interfaces.ILogger;
  userRepository: IUserRepository;
  categoryRepository: ICategoryRepository;
  tokenService: Interfaces.ITokenService;
  authService: Interfaces.IAuthService;
  authenticationMiddleware: AuthenticationMiddleware;
  otpRepository: IOtpRepository;
  userService: Interfaces.IUserService;
  categoryService: Interfaces.ICategoryService;
};

export function makeInfrastructure(): { [dependency in keyof Dependencies]: Resolver<Dependencies[dependency]> } {
  const logger = makeLogger();

  mongoose.connect('mongodb://localhost:27017/senior');

  const db = mongoose.connection;

  db.on('error', (err) => {
    logger.error({ detail: `Failed to establish a connection to MongoDB: ${err.message}` });
    process.exit(1);
  });

  db.once('open', () => {
    logger.info({ detail: 'Connected to MongoDB!' });
  });

  return {
    db: asValue(db),
    logger: asValue(logger),
    userRepository: asClass(UserRepository).singleton(),
    categoryRepository: asClass(CategoryRepository).singleton(),
    tokenService: asClass(TokenService).singleton(),
    authService: asClass(AuthService).singleton(),
    authenticationMiddleware: asClass(AuthenticationMiddleware).singleton(),
    otpRepository: asClass(OtpRepository).singleton(),
    userService: asClass(UserService).singleton(),
    categoryService: asClass(CategoryService).singleton(),
  };
}
