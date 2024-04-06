import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WorkerEntity } from '../workers'
import { BalancesProcessor } from './balances.processor'
import { BalancesScheduler } from './balances.scheduler'

@Module({
  imports: [TypeOrmModule.forFeature([WorkerEntity])],
  providers: [BalancesScheduler, BalancesProcessor],
})
export class BalancesModule {}
