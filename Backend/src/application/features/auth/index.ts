import { Dependencies } from '@infrastructure/di';
import { makeRegisterCommand } from './commands/register/register.command';
import { makeLoginCommand } from './commands/login/login.command';
import { makeVerifyForLoginCommand } from './commands/verify-login/verify.command';
import { makeResetPasswordCommand } from './commands/reset-password';
import { makeVerifyForResetPasswordCommand } from './commands/verify-reset-password';
import { makeGetProfileCommand } from './queries/get-profile';
import { makeGetUsersCommand } from './queries/list-users';

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
      getUsers: makeGetUsersCommand(dependencies),
    },
  };
}
