import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as joi from 'joi'
import { DataSourceOptions } from 'typeorm'
import {
  BULL_CONFIG_TOKEN,
  BullConfig,
  TYPEORM_CONFIG_TOKEN,
  baseConfig,
  baseConfigSchema,
  typeormConfig,
  typeormConfigSchema,
} from './config'
import { entities, migrations } from './ormconfig'
import { WorkersModule } from './workers'

@Module({
  imports: [
    WorkersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [baseConfig, typeormConfig],
      validationSchema: joi
        .object()
        .concat(baseConfigSchema)
        .concat(typeormConfigSchema),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...configService.get<DataSourceOptions>(TYPEORM_CONFIG_TOKEN),
        migrations,
        entities,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<BullConfig>(BULL_CONFIG_TOKEN).host,
          port: configService.get<BullConfig>(BULL_CONFIG_TOKEN).port,
        },
      }),
    }),
  ],
})
export class AppModule {}
