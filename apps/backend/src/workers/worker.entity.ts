import { randomUUID } from 'node:crypto'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum SalaryType {
  MONTHLY = 'MONTHLY',
  DAILY = 'DAILY',
}

@Entity()
export class WorkerEntity {
  @PrimaryColumn('uuid')
  id: string

  @Column({ enum: SalaryType })
  salaryType: SalaryType

  @Column()
  balance: number

  @Index()
  @CreateDateColumn({ type: 'timestamptz', default: 'NOW()', update: false })
  createdAt: Date

  @Index()
  @UpdateDateColumn({ type: 'timestamptz', default: 'NOW()' })
  updatedAt: Date

  @BeforeInsert()
  genDefaultWhenInsert?() {
    this.id = randomUUID()
  }
}
