import { Process, Processor } from '@nestjs/bull'
import { BALANCES_QUEUE, JOB_BALANCES_UPDATE } from './balances.constant'

@Processor(BALANCES_QUEUE)
export class BalancesProcessor {
  @Process(JOB_BALANCES_UPDATE)
  handleBalancesUpdate() {
    console.log('')
  }
}
