import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Address } from "./Address";
import { Brand } from "./Brand";

@Entity("branches")
export class Branch {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  name!: string;

  @Column({ type: "uuid", nullable: true })
  addressId?: string;

  @ManyToOne(() => Address, { eager: false, nullable: true })
  @JoinColumn({ name: "addressId" })
  address?: Address;

  @Column({ type: "uuid", nullable: false })
  brandId!: string;

  @ManyToOne(() => Brand, { eager: false, nullable: false })
  @JoinColumn({ name: "brandId" })
  brand!: Brand;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
