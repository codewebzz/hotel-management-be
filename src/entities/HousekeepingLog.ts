import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from './Room';
import { Staff } from './Staff';
import { Branch } from './Branch';

@Entity('housekeeping_logs')
export class HousekeepingLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  roomId!: string;

  @ManyToOne(() => Room, { eager: false, nullable: false })
  @JoinColumn({ name: 'roomId' })
  room!: Room;

  @Column({ type: 'uuid' })
  staffId!: string;

  @ManyToOne(() => Staff, { eager: false, nullable: false })
  @JoinColumn({ name: 'staffId' })
  staff!: Staff;

  @Column({ type: 'uuid' })
  branchId!: string;

  @ManyToOne(() => Branch, { eager: false, nullable: false })
  @JoinColumn({ name: 'branchId' })
  branch!: Branch;

  @Column({ type: 'varchar', length: 50, nullable: true })
  shift?: string;

  @Column({ type: 'varchar', length: 20 })
  status!: string;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt?: string;

  @Column({ type: 'timestamp', nullable: true })
  startTime?: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
