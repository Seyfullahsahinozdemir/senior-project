import { Dependencies } from '@infrastructure/di';
import { makeRegisterCommand } from './commands/auth/register/register.command';
import { makeLoginCommand } from './commands/auth/login/login.command';
import { makeVerifyForLoginCommand } from './commands/auth/verify-login/verify.command';
import { makeResetPasswordCommand } from './commands/auth/reset-password';
import { makeVerifyForResetPasswordCommand } from './commands/auth/verify-reset-password';
import { makeGetProfileCommand } from './queries/auth/get-profile';
import { makeGetUsersCommand } from './queries/user/list-users';
import { makeGetFollowersCommand } from './queries/user/get-followers';
import { makeGetFollowingCommand } from './queries/user/get-following';
import { makeFollowCommand } from './commands/user/follow';
import { makeUnFollowCommand } from './commands/user/unFollow';
import { makeCreateCommand } from './commands/category/create';
import { makeUpdateCommand } from './commands/category/update';
import { makeDeleteCommand } from './commands/category/delete';
import { makeGetCategoriesCommand } from './queries/category/get';

export function makeAuth(dependencies: Dependencies) {
  return {
    commands: {
      register: makeRegisterCommand(dependencies),
      login: makeLoginCommand(dependencies),
      verifyLogin: makeVerifyForLoginCommand(dependencies),
      resetPassword: makeResetPasswordCommand(dependencies),
      verifyResetPassword: makeVerifyForResetPasswordCommand(dependencies),
    },
    queries: {
      getProfile: makeGetProfileCommand(dependencies),
    },
  };
}

export function makeUser(dependencies: Dependencies) {
  return {
    commands: {
      follow: makeFollowCommand(dependencies),
      unFollow: makeUnFollowCommand(dependencies),
    },
    queries: {
      getProfile: makeGetProfileCommand(dependencies),
      getUsers: makeGetUsersCommand(dependencies),
      getFollowers: makeGetFollowersCommand(dependencies),
      getFollowing: makeGetFollowingCommand(dependencies),
    },
  };
}

export function makeCategory(dependencies: Dependencies) {
  return {
    commands: {
      create: makeCreateCommand(dependencies),
      update: makeUpdateCommand(dependencies),
      delete: makeDeleteCommand(dependencies),
    },
    queries: {
      get: makeGetCategoriesCommand(dependencies),
    },
  };
}
