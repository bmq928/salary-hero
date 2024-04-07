import { ConfigType } from '@nestjs/config'
import { Repository } from 'typeorm'
import { BalancesProcessor } from '../balances'
import { batchConfig } from '../config'
import { WorkerEntity } from '../workers'

const mockQueue = {
  addBulk: jest.fn(),
}

const mockBatchEnv: ConfigType<typeof batchConfig> = {
  workerParallelNumber: 2,
  workerPerUpdate: 1,
}

const mockRepo: Repository<WorkerEntity> = {
  count: () => 12,
} as any

describe('BalancesProcessor', () => {
  let service: BalancesProcessor

  beforeEach(() => {
    service = new BalancesProcessor(mockBatchEnv, mockRepo, mockQueue as any)
  })

  afterEach(() => {
    mockQueue.addBulk.mockReset()
  })

  describe('chunkBigJob()', () => {
    it('should create a job in queue', async () => {
      await service.chunkBigJob()
      expect(mockQueue.addBulk).toHaveBeenCalledTimes(1)
      expect(mockQueue.addBulk.mock.calls[0][0]).toHaveLength(2)
    })
  })
})
