import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Address } from './Address';
import { Company } from './Company';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
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

  @Column({ type: 'uuid', nullable: false })
  companyId!: string;

  @ManyToOne(() => Company, (company) => company.brands, { eager: false, nullable: false })
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
