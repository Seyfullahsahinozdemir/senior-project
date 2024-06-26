import { LoginUserDTO } from '@application/dto/auth/login.user';
import { RegisterUserDTO } from '@application/dto/auth/register.user';
import { Token } from '@application/dto/auth/token';
import { ITokenService } from '@application/interfaces';
import { IAuthService } from '@application/interfaces/services/authentication/IAuth';
import { IOtpRepository, IUserRepository } from '@application/persistence';
import { User } from '@domain/entities/identity/user';
import * as bcrypt from 'bcrypt';
import { otpGenerate } from './otp.service';
import { emailSend } from '@infrastructure/email/email.service';
import { VerifyOtpDTO } from '@application/dto/auth/verify.otp';
import { OtpTargetEnum } from '@application/enums/otp.target.enum';
import { NotFoundException, ValidationException } from '@application/exceptions';
import { ObjectId } from 'mongodb';
export class AuthService implements IAuthService {
  public readonly userRepository: IUserRepository;
  public readonly tokenService: ITokenService;
  public readonly otpRepository: IOtpRepository;
  public currentUserId: string | null;

  constructor({
    tokenService,
    userRepository,
    otpRepository,
  }: {
    tokenService: ITokenService;
    userRepository: IUserRepository;
    otpRepository: IOtpRepository;
  }) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.otpRepository = otpRepository;
    this.currentUserId = null;
  }

  async resetPassword(_id: string): Promise<boolean> {
    const user = await this.userRepository.findOne(_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otpData = otpGenerate();
    const emailText = 'Reset password otp code: ' + otpData.otp;

    const otp = await this.otpRepository.create({
      _id: new ObjectId(),
      email: user.email,
      otp: otpData.otp,
      target: OtpTargetEnum.RESETPASSWORD,
      expirationDate: otpData.expirationTime,
    });

    if (otp) {
      emailSend(user.email, 'Reset Password', emailText);

      return true;
    }
    throw new Error('An error occurred while otp process.');
  }

  async verifyForResetPassword(info: VerifyOtpDTO, password: string): Promise<boolean> {
    const user = await this.userRepository.find({ email: info.email, deletedAt: null });

    if (user.length == 0) {
      throw new NotFoundException('User not found');
    }

    const codes = await this.otpRepository.find({
      target: OtpTargetEnum.RESETPASSWORD,
      email: info.email,
    });
    if (codes.length <= 0) {
      throw new NotFoundException('Not found any otp code for specified user');
    }

    codes.sort((a, b) => (Date.parse(a.expirationDate.toString()) > Date.parse(b.expirationDate.toString()) ? -1 : 1));

    if (info.otpCode === codes[0].otp && Date.parse(codes[0].expirationDate.toString()) > new Date().getTime()) {
      await this.otpRepository.deleteMany({ email: info.email, target: OtpTargetEnum.RESETPASSWORD });

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      user[0].password = hash;
      user[0].updatedAt = new Date();
      user[0].updatedBy = user[0]._id?.toString();
      this.userRepository.update(user[0]._id?.toString() as string, user[0]);
      return true;
    }
    throw new ValidationException('Wrong otp code');
  }

  async getMyProfile(_id: string): Promise<User> {
    const user = await this.userRepository.findOne(_id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.deletedAt) {
      throw new NotFoundException('User not found.');
    }

    user.password = '';
    return user;
  }

  async verifyForLogin(info: VerifyOtpDTO): Promise<Token> {
    const codes = await this.otpRepository.find({
      target: OtpTargetEnum.LOGIN,
      email: info.email,
    });

    if (codes.length > 0) {
      codes.sort((a, b) =>
        Date.parse(a.expirationDate.toString()) > Date.parse(b.expirationDate.toString()) ? -1 : 1,
      );
    }

    if (info.otpCode == codes[0].otp && Date.parse(codes[0].expirationDate.toString()) > new Date().getTime()) {
      await this.otpRepository.deleteMany({ email: info.email, target: OtpTargetEnum.LOGIN });

      const user = await this.userRepository.find({ email: info.email });
      if (user.length > 0) {
        const accessToken = this.tokenService.generateToken({
          _id: user[0]._id?.toString() as string,
          username: user[0].username,
          email: user[0].email,
          isAdmin: user[0].isAdmin,
        });

        const refreshToken = this.tokenService.generateRefreshToken({
          _id: user[0]._id?.toString() as string,
          username: user[0].username,
          email: user[0].email,
          isAdmin: user[0].isAdmin,
        });

        return { accessToken, refreshToken, user: user[0] };
      }
    }
    throw new Error('Verification error.');
  }

  async login(info: LoginUserDTO): Promise<boolean> {
    let user: User = await this.userRepository.findByUsernameAsync(info.usernameOrEmail);

    if (!user) {
      user = await this.userRepository.findByEmailAsync(info.usernameOrEmail);
      if (!user) {
        throw new NotFoundException('User not found.');
      }
    }

    if (!bcrypt.compareSync(info.password, user.password)) {
      throw new NotFoundException('User not found');
    }

    const otpData = otpGenerate();
    const emailText = 'Otp login is active, please use the code to login: ' + otpData.otp;

    const otp = await this.otpRepository.create({
      _id: new ObjectId(),
      email: user.email,
      otp: otpData.otp,
      target: OtpTargetEnum.LOGIN,
      expirationDate: otpData.expirationTime,
    });

    if (otp) {
      if (await emailSend(user.email, 'Otp Login', emailText)) {
        return true;
      }
    }
    return false;
  }

  async register(info: RegisterUserDTO): Promise<{ _id: string }> {
    let user: User = await this.userRepository.findByUsernameAsync(info.username);

    if (user) {
      throw new Error('User already exist.');
    }
    user = await this.userRepository.findByEmailAsync(info.email);

    if (user) {
      throw new Error('User already exist.');
    }

    const salt = bcrypt.genSaltSync(10);

    const hash = bcrypt.hashSync(info.password, salt);

    user = new User(info.firstName, info.lastName, info.username, info.email, hash);
    const entity: User = await this.userRepository.create(user);

    if (!entity) {
      throw new Error('Error occurred while register.');
    }
    user.createEntity(entity._id?.toString() as string);
    await this.userRepository.update(entity._id?.toString() as string, user);
    return { _id: entity._id?.toString() as string };
  }
}
