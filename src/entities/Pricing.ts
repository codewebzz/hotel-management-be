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
import { RoomType } from './RoomType';

@Entity('pricings')
@Unique(['roomTypeId', 'seasonName', 'startDate', 'endDate'])
export class Pricing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  roomTypeId!: string;

  @ManyToOne(() => RoomType, { eager: false, nullable: false })
  @JoinColumn({ name: 'roomTypeId' })
  roomType!: RoomType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice!: number;

  @Column({ type: 'varchar', length: 255 })
  seasonName!: string;

  @Column({ type: 'date' })
  startDate!: string;

  @Column({ type: 'date' })
  endDate!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

