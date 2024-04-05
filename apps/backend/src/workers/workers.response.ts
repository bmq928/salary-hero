import { Type } from 'class-transformer'
import { PageInfo } from './dto/paginated.dto'
import { CurrencyCode, SalaryType, WorkerEntity } from './worker.entity'

export class WorkerResponse implements WorkerEntity {
  id: string
  salaryType: SalaryType
  balance: number
  currency: CurrencyCode
  createdAt: Date
  updatedAt: Date
}

export class WorkerPaginatedResponse {
  @Type(() => WorkerResponse)
  data: WorkerResponse[]

  @Type(() => PageInfo)
  pageInfo: PageInfo
}
