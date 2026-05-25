import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Room, RoomStatus } from './Room';

@Entity('room_status_history')
export class RoomStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  roomId!: string;

  @ManyToOne(() => Room, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room!: Room;

  @Column({
    type: 'enum',
    enum: RoomStatus,
  })
  status!: RoomStatus;

  @Column({ type: 'timestamp' })
  startTime!: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;
}
