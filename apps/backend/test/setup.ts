import { faker } from '@faker-js/faker'
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { DataSource } from 'typeorm'
import { AppModule } from '../src/app.module'
import { TYPEORM_CONFIG_TOKEN } from '../src/config'
import { WorkerEntity } from '../src/workers'
import * as seedData from './seed-data'

export interface TestState {
  app: INestApplication
  pg?: DataSource
}

export let testState: TestState

beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()
  const app = moduleFixture.createNestApplication()

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })
  await app.init()

  const ds = app.get(DataSource)
  await ds?.runMigrations({ fake: true })

  testState = { app, pg: ds }
})

afterAll(async () => {
  await testState.pg?.destroy()
  await testState.app?.close()
})

beforeEach(async () => {
  faker.seed(123)

  await testState.pg?.getRepository(WorkerEntity).save(seedData.workers)
})

afterEach(async () => {
  if (!testState.app) throw new Error('[testing]: app is not initialized')

  // eslint-disable-next-line no-unsafe-optional-chaining
  const { schema } = testState.app.get(ConfigService)?.get(TYPEORM_CONFIG_TOKEN)

  const pgTables = await testState.pg?.query<Record<string, string>[]>(
    'select * from pg_tables;'
  )
  if (!pgTables) throw new Error('[testing]: no pg tables to cleanup')

  const appTables = pgTables.filter(
    (t) => t['schemaname'] === schema && t['tablename'] !== 'migrations'
  )

  await Promise.all(
    appTables.map(({ schemaname, tablename }) =>
      testState.pg?.query(`truncate table ${schemaname}.${tablename}`)
    )
  )
})
