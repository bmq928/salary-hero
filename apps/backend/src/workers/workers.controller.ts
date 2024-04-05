import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'
import { CreateWorkerDto } from './dto'
import { PaginatedQueryDto } from './dto/paginated.dto'
import { WorkerPaginatedResponse, WorkerResponse } from './workers.response'
import { WorkersService } from './workers.service'

@ApiTags('workers')
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get()
  list(@Query() query: PaginatedQueryDto): Promise<WorkerPaginatedResponse> {
    return this.workersService.list(query).then(([data, total]) =>
      plainToInstance(WorkerPaginatedResponse, {
        data,
        pageInfo: { total, ...query },
      })
    )
  }

  @Post(':id')
  create(@Body() body: CreateWorkerDto): Promise<WorkerResponse> {
    return this.workersService
      .create(body)
      .then((data) => plainToInstance(WorkerResponse, data))
  }
}
