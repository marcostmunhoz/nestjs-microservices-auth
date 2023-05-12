import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  async create(accountId: string, email: string): Promise<User> {
    const password = Math.random().toString(36).substring(2, 10);
    const account = new this.user({ email, accountId, password });
    await account.save();

    console.log(`User created - password: ${password}`);

    return account;
  }

  async update(accountId: string, email: string): Promise<User> {
    const account = this.user.findOneAndUpdate({ accountId }, { email });

    console.log(`User updated email updated to ${email}`);

    return account;
  }

  async authenticate(email: string, password: string): Promise<string> {
    const user = await this.user.findOne({ email });

    if (!user || user.password !== password) {
      throw new Error('Invalid credentials.');
    }

    return Buffer.from(`${user.accountId}:${user.password}`).toString('base64');
  }

  async validate(token: string): Promise<User> {
    const decoded = Buffer.from(token, 'base64').toString();
    const [accountId, password] = decoded.split(':');
    const user = await this.user.findOne({ accountId });

    if (!user || user.password !== password) {
      throw new Error('Unauthorized');
    }

    return user;
  }
}
