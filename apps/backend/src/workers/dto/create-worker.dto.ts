/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsEnum, IsInt, Min } from 'class-validator'
import { CurrencyCode, SalaryType, WorkerEntity } from '../worker.entity'

export class CreateWorkerDto
  implements
    Pick<WorkerEntity, 'salaryType' | 'balance' | 'currency' | 'salary'>
{
  @IsInt()
  @Min(0)
  salary: number

  @IsEnum(CurrencyCode)
  currency: CurrencyCode

  @IsEnum(SalaryType)
  salaryType: SalaryType

  @IsInt()
  @Min(0)
  balance: number = 0
}
