import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { userRole } from "../utils/types";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({
    type: "enum",
    enum: userRole,
    default: userRole.STUDENT,
  })
  role: userRole;

  @Column({
    name: "firebase_uid",
    type: "varchar",
    unique: true,
  })
  firebaseUid: string;
}
