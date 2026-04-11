import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";
import { RoomType } from "./RoomType";
import { Amenity } from "./Amenity";

@Entity("room_type_amenities")
@Unique(["roomTypeId", "amenityId"])
export class RoomTypeAmenity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  roomTypeId!: string;

  @Column({ type: "uuid" })
  amenityId!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @ManyToOne(() => RoomType, (roomType) => roomType.roomTypeAmenities, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "roomTypeId" })
  roomType!: RoomType;

  @ManyToOne(() => Amenity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "amenityId" })
  amenity!: Amenity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
