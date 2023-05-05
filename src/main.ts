import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { protobufPackage } from './auth.pb';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const host = config.get('AUTH_SERVICE_SERVER_HOST');
  const port = config.get('AUTH_SERVICE_PORT');

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      url: `${host}:${port}`,
      package: protobufPackage,
      protoPath: join(
        'node_modules',
        'nestjs-microservices-proto',
        'proto',
        'auth.proto',
      ),
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
