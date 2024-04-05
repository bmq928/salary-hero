import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import * as _ from 'lodash'
import request from 'supertest'
import { CurrencyCode, SalaryType, WorkerEntity } from '../src/workers'
import { CreateWorkerDto } from '../src/workers/dto'
import * as seedData from './seed-data'
import { testState } from './setup'

const genDto = (num: number, idMembers?: string[]): CreateWorkerDto[] =>
  seedData
    .genFakeWorkers(num)
    .map((o) => _.pick(o, ['currency', 'balance', 'salaryType']))

describe.each(['/v1/workers'])('[POST] %s', (baseUrl: string) => {
  it.each(
    genDto(
      3,
      faker.helpers.arrayElements(seedData.workers).map((u) => u.id)
    )
  )('should create new entity when dto is valid \n%j', (dto: CreateWorkerDto) =>
    request(testState.app?.getHttpServer())
      .post(baseUrl)
      .send(dto)
      .then(() =>
        expect(
          testState.pg?.getRepository(WorkerEntity).countBy(dto)
        ).resolves.toBe(1)
      )
  )

  it.each(genDto(3))(
    'should response new created entity \n%j',
    (dto: CreateWorkerDto) =>
      request(testState.app?.getHttpServer())
        .post(baseUrl)
        .send(dto)
        .expect(({ body }) =>
          expect(body).toStrictEqual({
            id: expect.stringMatching(
              /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/ //uuid
            ),
            createdAt: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/ //date string
            ),
            updatedAt: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/ //date string
            ),
            ...dto,
          })
        )
        .expect(HttpStatus.CREATED)
  )

  it.each([
    {},
    {
      balance: -1,
      salaryType: SalaryType.DAILY,
      currency: CurrencyCode.THB,
    },
    { balance: 100, salaryType: 'kame', currency: CurrencyCode.USD },
    { balance: 100, salaryType: SalaryType.MONTHLY, currency: 'kmae' },
  ])('should be trim and validate dto \n%j', (dto) =>
    request(testState.app?.getHttpServer())
      .post(baseUrl)
      .send(dto)
      .expect(({ body }) =>
        expect(body).toStrictEqual({
          error: 'Bad Request',
          message: expect.arrayContaining([]),
          statusCode: HttpStatus.BAD_REQUEST,
        })
      )
      .expect(HttpStatus.BAD_REQUEST)
  )
})
