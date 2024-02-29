import { asClass, asValue, Resolver } from 'awilix';
import mongoose from 'mongoose';
import * as Interfaces from '@application/interfaces';
import { makeLogger } from './logger';
import { IUserRepository } from '@application/persistence/IUserRepository';
import { UserRepository } from './persistence/user.repository';
import { AuthService } from './auth/auth.service';
import { TokenService } from './auth/token.service';
import { AuthenticationMiddleware } from './middlewares/authentication.middleware';
import { IOtpRepository } from '@application/persistence';
import { OtpRepository } from './persistence/otp.repository';

export type Dependencies = {
  db: mongoose.Connection;
  logger: Interfaces.ILogger;
  userRepository: IUserRepository;
  tokenService: Interfaces.ITokenService;
  authService: Interfaces.IAuthService;
  authenticationMiddleware: AuthenticationMiddleware;
  otpRepository: IOtpRepository;
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
    tokenService: asClass(TokenService).singleton(),
    authService: asClass(AuthService).singleton(),
    authenticationMiddleware: asClass(AuthenticationMiddleware).singleton(),
    otpRepository: asClass(OtpRepository).singleton(),
  };
}
