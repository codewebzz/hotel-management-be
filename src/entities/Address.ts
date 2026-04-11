import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  address!: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  lat!: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  long!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
