import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'
import * as _ from 'lodash'
import request from 'supertest'
import { PaginatedQueryDto, SortEnum } from '../src/workers/dto'
import * as seedData from './seed-data'
import { testState } from './setup'

export const genValidPaginatedQuery = (
  omitRandKeys = false
): Partial<PaginatedQueryDto> =>
  [
    {
      page: faker.number.int({ min: 1 }),
      perPage: faker.number.int({ min: 1, max: 100 }),
      sort: faker.helpers.enumValue(SortEnum),
      sortBy: faker.helpers.arrayElement([
        'createdAt',
        'updatedAt',
        'balance',
        'salaryType',
      ]) as any,
    },
  ].map((q) =>
    omitRandKeys ? _.omit(q, faker.helpers.arrayElements(Object.keys(q))) : q
  )[0]

describe.each(['/v1/workers'])('[GET] %s', (baseUrl: string) => {
  it.each([...Array(3)].map(() => genValidPaginatedQuery(true)))(
    'should response a list of worker that user created and was invited into, relation should not have password \n%j',
    (q: Partial<PaginatedQueryDto>) =>
      request(testState.app?.getHttpServer())
        .get(baseUrl)
        .query(q)
        .send()
        .expect(({ body }) => {
          const fullQuery: PaginatedQueryDto = {
            ...new PaginatedQueryDto(),
            ...q,
          }
          const paginatedData = _.orderBy(
            seedData.workers,
            [fullQuery.sortBy],
            fullQuery.sort
          ).slice(
            (fullQuery.page - 1) * fullQuery.perPage,
            fullQuery.page * fullQuery.perPage
          )

          expect(body).toEqual(
            JSON.parse(
              JSON.stringify({
                data: paginatedData,
                pageInfo: {
                  ...fullQuery,
                  total: seedData.workers.length,
                },
              })
            )
          )
        })
        .expect(HttpStatus.OK)
  )

  it.each([
    { page: 0 },
    { page: -1 },
    { page: 1.34 },
    { perPage: 0 },
    { perPage: -1 },
    { perPage: 1.345 },
    { sort: 'adskfj' },
    { sortBy: 'kame' },
  ])('should response bad request if query is invalid', (q) =>
    request(testState.app?.getHttpServer())
      .get(baseUrl)
      .query(q)
      .send()
      .expect(({ body }) =>
        expect(body).toStrictEqual({
          message: expect.arrayContaining([]),
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        })
      )
      .expect(HttpStatus.BAD_REQUEST)
  )
})
