import { DataSource } from 'typeorm'
import { Init1712329865752 } from '../migrations/1712329865752-Init'
import { typeormConfig } from './config'
import { WorkerEntity } from './workers'

export const entities = [WorkerEntity]
export const migrations = [Init1712329865752]
export default new DataSource({
  ...typeormConfig(),
  entities,
  migrations,
})
