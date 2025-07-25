import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  action!: string;

  @Column()
  userId!: string;

  @Column()
  actor!: string;

  @Column({ type: "jsonb", nullable: true })
  before?: any;

  @Column({ type: "jsonb", nullable: true })
  after?: any;

  @Column({ type: "jsonb", nullable: true })
  details?: any;

  @CreateDateColumn()
  createdAt!: Date;
}
