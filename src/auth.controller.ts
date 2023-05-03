import { Controller } from '@nestjs/common';
import {
  AUTH_SERVICE_NAME,
  LoginRequest,
  LoginResponse,
  ValidateRequest,
  ValidateResponse,
} from './auth.pb';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AuthController {
  private readonly users = [
    {
      id: 1,
      email: 'user1@example.com',
      password: 'password1',
    },
    {
      id: 2,
      email: 'user2@example.com',
      password: 'password2',
    },
    {
      id: 3,
      email: 'user3@example.com',
      password: 'password3',
    },
  ];

  @GrpcMethod(AUTH_SERVICE_NAME, 'Login')
  async login(request: LoginRequest): Promise<LoginResponse> {
    const user = this.users.find(
      (user) =>
        user.email === request.email && user.password === request.password,
    );

    if (!user) {
      return {
        status: 401,
        error: ['Unauthorized'],
        token: null,
      };
    }

    const token = Buffer.from(`${user.id}:${user.email}`).toString('base64');

    return {
      status: 200,
      error: [],
      token,
    };
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Validate')
  async validate(request: ValidateRequest): Promise<ValidateResponse> {
    const token = Buffer.from(request.token, 'base64').toString();
    const [id, email] = token.split(':');

    const user = this.users.find(
      (user) => user.id === Number(id) && user.email === email,
    );

    if (!user) {
      return {
        status: 401,
        error: ['Unauthorized'],
        accountId: null,
      };
    }

    return {
      status: 200,
      error: [],
      accountId: String(user.id),
    };
  }
}
