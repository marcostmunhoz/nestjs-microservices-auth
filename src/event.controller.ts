import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

export type AccountCreatedEvent = {
  accountId: string;
  email: string;
};

export type AccountUpdatedEvent = AccountCreatedEvent;

@Controller()
export class EventController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern('account.created')
  async handleAccountCreated(data: AccountCreatedEvent) {
    this.authService.create(data.accountId, data.email);
  }

  @EventPattern('account.updated')
  async handleAccountUpdated(data: AccountUpdatedEvent) {
    this.authService.update(data.accountId, data.email);
  }
}
