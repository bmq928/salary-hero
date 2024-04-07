## Components
- Controller (format: *.controller.ts): Handle API
- Entity (format: *.entity.ts): Represent table in Postgres
- Dto (format: *.dto.ts): data transfer object
- Service (format: *.service.ts): Business logic
- Scheduler (format: *.scheduler.ts): Create cronjob
- Processor (format: *.processor.ts): Receive job and handle it
- Config (format: *.config.ts): Handle env and config
## High level design 
### API
- For simplicity, there are only 2 API without authentication:
	- List workers
	- Create workers
### Jobs
- Cronjob:
	- Every 00:01am, create a job (called: chunkBigJob)
- Job (chunkBigJob):
	- This job split the task update balance of every worker into multiple smaller chunks.
	- Every chunk of workers 's balances will be calculated by job (handleBalancesUpdate)
- Job (handleBalancesUpdate):
	- Calculate balances of every workers in a chunk.
### Config: 
- Change the value in .env.dev (development environment) or .env.test (testing environment).
### Start project:
- Start 3rd-party services: `docker compose up -d`
- Install dependencies: `pnpm install`
- Run migrations (if need): `pnpm nx migration:run backend`
- Start: `pnpm nx serve backend`
- Testing: `pnpm nx test backend`
- Swagger: on /swagger
## FAQ
- Q: Why is logic of split tasks not in cronjob?
  A: Every job handled in *.processor.ts are stored in Redis. Create a separated job for splitting tasks allows it to be tracked and retries. 
- Q: Why split the job into many smaller chunks?
  A: Allow parallel processing if the service is scaled with more than 1 instance. Each chunk will be remained in a job. Every job will contain offset (offset of worker in database) and limit (number of workers will be fetched). After processing a batch of workers, job' s progress will be saved. It allows job can be retried multiple times without updating a worker multiple times.
