import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { config } from '@app/config';
import { CreateUserDto } from '@app/dtos';
import { BadRequestException, ConflictException } from '@app/exceptions';
import { DataStoredInToken, TokenData, IUser } from '@app/interfaces';
import { userModel } from '@app/models';
import { isEmpty } from '@app/utils';

export class AuthService {
  public users = userModel;

  public async signup(userData: CreateUserDto): Promise<IUser> {
    if (isEmpty(userData)) throw new BadRequestException('userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email });
    if (findUser) throw new ConflictException(`This email ${userData.email} already exists`);

    const hashedPassword: string = await hash(userData.password, config.HASH_SALT);
    const createUserData: IUser = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: IUser }> {
    if (isEmpty(userData)) throw new BadRequestException('userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new ConflictException(`This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new ConflictException('Password is not matching');

    const tokenData: TokenData = this.createToken(findUser);
    const cookie: string = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: IUser): Promise<IUser> {
    if (isEmpty(userData)) throw new BadRequestException('userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new ConflictException(`This email ${userData.email} was not found`);

    return findUser;
  }

  public createToken(user: IUser): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = config.JWT.JWT_SECRET;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}
