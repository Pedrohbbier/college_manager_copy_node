import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { CourseModality, CourseType } from "../utils/types";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", nullable: true })
  image?: string;

  @Column({
    type: "enum",
    enum: CourseModality,
    default: CourseModality.PRESENCIAL,
  })
  modality: CourseModality;

  @Column({
    type: "enum",
    enum: CourseType,
    default: CourseType.BACHARELADO,
  })
  type: CourseType;

  @Column({ type: "int", nullable: true })
  enade?: number;
}
