import { faker } from '@faker-js/faker'
import * as _ from 'lodash'
import { CurrencyCode, SalaryType, WorkerEntity } from '../src/workers'

export const genFakeWorkers = (num = 12): WorkerEntity[] =>
  _.range(num).map(() => ({
    id: faker.string.uuid(),
    balance: faker.number.int({ min: 0, max: 100000 }),
    currency: faker.helpers.arrayElement(Object.values(CurrencyCode)),
    salaryType: faker.helpers.arrayElement(Object.values(SalaryType)),
    createdAt: faker.date.past(),
    updatedAt: faker.date.future(),
  }))

export const workers = genFakeWorkers()
