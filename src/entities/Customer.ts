import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './Company';
import { Address } from './Address';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @Column({ type: 'uuid', nullable: true })
  addressId?: string;

  @ManyToOne(() => Address, { eager: false, nullable: true })
  @JoinColumn({ name: 'addressId' })
  address?: Address;

  @Column({ type: 'varchar', length: 50, nullable: true })
  idType?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  idNumber?: string;

  @Column({ type: 'uuid' })
  companyId!: string;

  @ManyToOne(() => Company, { eager: false, nullable: false })
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
