import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
