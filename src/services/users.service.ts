import { hash } from 'bcrypt';
import { CreateUserDto } from '@app/dtos';
import { BadRequestException, ConflictException } from '@app/exceptions';
import { IUser } from '@app/interfaces';
import { userModel } from '@models/users.model';
import { isEmpty } from '@utils/util';

export class UserService {
  public users = userModel;

  public async findAllUser(): Promise<IUser[]> {
    const users: IUser[] = await this.users.find();
    return users;
  }

  public async findUserById(userId: string): Promise<IUser> {
    if (isEmpty(userId)) throw new BadRequestException('UserId is empty');

    const findUser: IUser = await this.users.findOne({ _id: userId });
    if (!findUser) throw new ConflictException("User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<IUser> {
    if (isEmpty(userData)) throw new BadRequestException('userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email });
    if (findUser) throw new ConflictException(`This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: IUser = await this.users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<IUser> {
    if (isEmpty(userData)) throw new BadRequestException('userData is empty');

    if (userData.email) {
      const findUser: IUser = await this.users.findOne({ email: userData.email });
      if (findUser && findUser._id != userId) throw new ConflictException(`This email ${userData.email} already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: IUser = await this.users.findByIdAndUpdate(userId, { userData });
    if (!updateUserById) throw new ConflictException("User doesn't exist");

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<IUser> {
    const deleteUserById: IUser = await this.users.findByIdAndDelete(userId);
    if (!deleteUserById) throw new ConflictException("User doesn't exist");

    return deleteUserById;
  }
}
