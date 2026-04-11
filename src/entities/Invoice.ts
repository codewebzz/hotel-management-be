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
import { Booking } from './Booking';

@Entity('invoices')
@Unique(['invoiceNumber'])
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  invoiceNumber!: string;

  @Column({ type: 'uuid' })
  bookingId!: string;

  @ManyToOne(() => Booking, { eager: false, nullable: false })
  @JoinColumn({ name: 'bookingId' })
  booking!: Booking;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  finalAmount!: number;

  @Column({ type: 'varchar', length: 30 })
  paymentStatus!: string; // pending | paid | cancelled | partial

  @Column({ type: 'varchar', length: 30, nullable: true })
  paymentMethod?: string; // cash | card | upi | bank_transfer

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount!: number;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

