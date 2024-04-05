import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateWorkerDto } from './dto'
import { PaginatedQueryDto } from './dto/paginated.dto'
import { WorkerEntity } from './worker.entity'

@Injectable()
export class WorkersService {
  constructor(
    @InjectRepository(WorkerEntity)
    private readonly workersRepo: Repository<WorkerEntity>
  ) {}

  list({
    perPage,
    page,
    sort,
    sortBy,
  }: PaginatedQueryDto): Promise<[WorkerEntity[], number]> {
    return this.workersRepo.findAndCount({
      take: perPage,
      skip: (page - 1) * perPage,
      order: { [sortBy]: sort },
    })
  }

  create(body: CreateWorkerDto): Promise<WorkerEntity> {
    return this.workersRepo.save(this.workersRepo.create(body))
  }
}
