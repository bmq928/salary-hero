import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as joi from 'joi'
import { DataSourceOptions } from 'typeorm'
import {
  TYPEORM_CONFIG_TOKEN,
  baseConfig,
  baseConfigSchema,
  typeormConfig,
  typeormConfigSchema,
} from './config'
import { entities, migrations } from './ormconfig'
import { WorkersModule } from './workers/workers.module'

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
  ],
})
export class AppModule {}
