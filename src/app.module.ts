import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { User } from './users/entities/user.entity';
import { Payment } from './payments/entities/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfgService: ConfigService) => ({
        type: 'postgres',
        host: cfgService.get('DB_HOST'),
        port: cfgService.get('DB_PORT'),
        username: cfgService.get('DB_USER'),
        password: cfgService.get('DB_PASS'),
        database: cfgService.get('DB_NAME'),
        entities: [User, Payment],
        autoLoadEntities: true,
        synchronize: true, // Temporalmente habilitado para crear tablas
        migrationsRun: false,
        logging: cfgService.get('NODE_ENV') !== 'production',
        ssl: cfgService.get('NODE_ENV') === 'production',
      }),
    }),
    UsersModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
