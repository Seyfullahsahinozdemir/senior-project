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
import { makeUpdateCommand } from './commands/category/update';
import { makeCreateCommand as createCategoryCommand } from './commands/category/create';
import { makeDeleteCommand as deleteCategoryCommand } from './commands/category/delete';
import { makeCreateCommand as createItemCommand } from './commands/item/create';
import { makeGetItemsCommand as getItemsCommand } from './queries/item/get';
import { makeDeleteCommand as deleteItemCommand } from './commands/item/delete';
import { makeGetCategoriesCommand as getCategoriesCommand } from './queries/category/get';
import { makeUploadCommand } from './commands/item/upload';

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
      create: createCategoryCommand(dependencies),
      update: makeUpdateCommand(dependencies),
      delete: deleteCategoryCommand(dependencies),
    },
    queries: {
      get: getCategoriesCommand(dependencies),
    },
  };
}

export function makeItem(dependencies: Dependencies) {
  return {
    commands: {
      create: createItemCommand(dependencies),
      delete: deleteItemCommand(dependencies),
      upload: makeUploadCommand(dependencies),
    },
    queries: {
      get: getItemsCommand(dependencies),
    },
  };
}
