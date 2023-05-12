import { Controller } from '@nestjs/common';
import {
  AUTH_SERVICE_NAME,
  LoginRequest,
  LoginResponse,
  ValidateRequest,
  ValidateResponse,
} from './auth.pb';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'Login')
  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const token = await this.authService.authenticate(
        request.email,
        request.password,
      );

      return {
        status: 200,
        error: [],
        token,
      };
    } catch (error) {
      return {
        status: 401,
        error: [error.message],
        token: null,
      };
    }
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'Validate')
  async validate(request: ValidateRequest): Promise<ValidateResponse> {
    try {
      const user = await this.authService.validate(request.token);

      return {
        status: 200,
        error: [],
        accountId: user.accountId,
      };
    } catch (error) {
      return {
        status: 401,
        error: [error.message],
        accountId: null,
      };
    }
  }
}
