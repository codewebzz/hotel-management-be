import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { RoomTypeAmenity } from './RoomTypeAmenity';
import { Branch } from './Branch';

@Entity('room_types')
export class RoomType {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  branchId?: string;

  @ManyToOne(() => Branch, { eager: false, nullable: true })
  @JoinColumn({ name: 'branchId' })
  branch?: Branch;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => RoomTypeAmenity, (roomTypeAmenity) => roomTypeAmenity.roomType)
  roomTypeAmenities!: RoomTypeAmenity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

