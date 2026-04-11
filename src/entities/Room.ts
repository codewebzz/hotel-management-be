import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoomType } from './RoomType';
import { Company } from './Company';
import { Brand } from './Brand';
import { Branch } from './Branch';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  roomNumber!: string;

  @Column({ type: 'uuid' })
  roomTypeId!: string;

  @ManyToOne(() => RoomType, { eager: false, nullable: false })
  @JoinColumn({ name: 'roomTypeId' })
  roomType!: RoomType;

  @Column({ type: 'integer', nullable: true })
  floor?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'uuid' })
  companyId!: string;

  @ManyToOne(() => Company, { eager: false, nullable: false })
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  @Column({ type: 'uuid' })
  brandId!: string;

  @ManyToOne(() => Brand, { eager: false, nullable: false })
  @JoinColumn({ name: 'brandId' })
  brand!: Brand;

  @Column({ type: 'uuid' })
  branchId!: string;

  @ManyToOne(() => Branch, { eager: false, nullable: false })
  @JoinColumn({ name: 'branchId' })
  branch!: Branch;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

