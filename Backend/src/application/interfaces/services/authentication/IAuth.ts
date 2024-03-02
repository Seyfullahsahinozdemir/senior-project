import { LoginUserDTO } from '@application/dto/auth/login.user';
import { RegisterUserDTO } from '@application/dto/auth/register.user';
import { Token } from '@application/dto/auth/token';
import { VerifyOtpDTO } from '@application/dto/auth/verify.otp';
import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { User } from '@domain/entities';

export interface IAuthService {
  currentUserId: string | null;

  login(info: LoginUserDTO): Promise<boolean>;
  register(info: RegisterUserDTO): Promise<{ _id: string }>;
  verifyForLogin(info: VerifyOtpDTO): Promise<Token>;
  getMyProfile(_id: string): Promise<User>;
  listUsers(info: PaginatedRequest): Promise<User[]>;
  resetPassword(_id: string): Promise<boolean>;
  verifyForResetPassword(info: VerifyOtpDTO, password: string): Promise<boolean>;
}
