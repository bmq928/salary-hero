import { BalancesScheduler, JOB_BALANCES_CHUNK_BIG_JOB } from '../balances'

const mockQueue = {
  add: jest.fn(),
}

describe('BalancesScheduler', () => {
  let service: BalancesScheduler

  beforeEach(() => {
    service = new BalancesScheduler(mockQueue as any)
  })

  afterEach(() => {
    mockQueue.add.mockReset()
  })

  describe('addJob()', () => {
    it('should create a job in queue', async () => {
      await service.addJob()
      expect(mockQueue.add).toHaveBeenCalledTimes(1)
      expect(mockQueue.add).toHaveBeenCalledWith(
        JOB_BALANCES_CHUNK_BIG_JOB,
        {},
        { removeOnComplete: true, removeOnFail: false }
      )
    })
  })
})
