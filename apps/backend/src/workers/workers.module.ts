import { Module } from '@nestjs/common'
import { WorkersConsumer } from './workers.consumer'
import { WorkersController } from './workers.controller'
import { WorkersService } from './workers.service'

@Module({
  controllers: [WorkersController],
  providers: [WorkersConsumer, WorkersService],
})
export class WorkersModule {}
