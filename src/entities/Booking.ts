import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Customer } from './Customer';
import { Room } from './Room';
import { Branch } from './Branch';

@Entity('bookings')
@Unique(['bookingNumber'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  bookingNumber!: string;

  @Column({ type: 'uuid' })
  customerId!: string;

  @ManyToOne(() => Customer, { eager: false, nullable: false })
  @JoinColumn({ name: 'customerId' })
  customer!: Customer;

  @Column({ type: 'uuid' })
  roomId!: string;

  @ManyToOne(() => Room, { eager: false, nullable: false })
  @JoinColumn({ name: 'roomId' })
  room!: Room;

  @Column({ type: 'uuid' })
  branchId!: string;

  @ManyToOne(() => Branch, { eager: false, nullable: false })
  @JoinColumn({ name: 'branchId' })
  branch!: Branch;

  @Column({ type: 'date' })
  checkInDate!: string;

  @Column({ type: 'date' })
  checkOutDate!: string;

  @Column({ type: 'integer' })
  adults!: number;

  @Column({ type: 'integer', default: 0 })
  children!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  finalAmount!: number;

  @Column({ type: 'varchar', length: 30 })
  status!: string; // pending | confirmed | checked_in | checked_out | cancelled

  @Column({ type: 'text', nullable: true })
  specialRequests?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

