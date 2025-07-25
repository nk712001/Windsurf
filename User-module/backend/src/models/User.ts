import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 50 })
  firstName!: string;

  @Column({ length: 50 })
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true, length: 20 })
  phoneNumber?: string;

  @Column()
  dateOfBirth!: Date;

  @Column("jsonb")
  address!: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Column({ length: 20 })
  department!: string;

  @Column({ length: 50 })
  position!: string;

  @Column()
  startDate!: Date;

  @Column({ length: 20 })
  status!: string;

  @Column()
  password!: string;

  @Column({ length: 20, default: "user" })
  role!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
