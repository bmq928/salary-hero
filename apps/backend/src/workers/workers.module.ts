import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WorkerEntity } from './worker.entity'
import { WorkersConsumer } from './workers.consumer'
import { WorkersController } from './workers.controller'
import { WorkersService } from './workers.service'

@Module({
  imports: [TypeOrmModule.forFeature([WorkerEntity])],
  controllers: [WorkersController],
  providers: [WorkersConsumer, WorkersService],
})
export class WorkersModule {}
