import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DataSource } from 'typeorm'
import { AppModule } from './app.module'
import { baseConfig } from './config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const { host, port, basePath }: ConfigType<typeof baseConfig> = app.get(
    baseConfig.KEY
  )
  const ds = app.get(DataSource)
  await ds.runMigrations()

  app.setGlobalPrefix(basePath)
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  await app.listen(port, host)
  Logger.log(`running on: http://localhost:${port}${basePath}`)
}

bootstrap()
