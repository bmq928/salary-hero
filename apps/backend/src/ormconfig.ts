import { DataSource } from 'typeorm'
import { Init1712329865752 } from '../migrations/1712329865752-Init'
import { AddCurrencyCode1712332401008 } from '../migrations/1712332401008-AddCurrencyCode'
import { typeormConfig } from './config'
import { WorkerEntity } from './workers'

export const entities = [WorkerEntity]
export const migrations = [Init1712329865752, AddCurrencyCode1712332401008]
export default new DataSource({
  ...typeormConfig(),
  entities,
  migrations,
})
