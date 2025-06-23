import { ProjectionType } from "@features/bananagl/camera/cameraInterface";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Project } from "./project";

@Entity("saved_views")
export class SavedView {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column() name!: string;

  @Column("float", { array: true }) cameraPosition!: [number, number, number];
  @Column("float", { array: true }) cameraTarget!: [number, number, number];

  @Column({ type: "enum", enum: ProjectionType, default: ProjectionType.ORTHOGRAPHIC })
  projectionType!: ProjectionType;

  @Column("float", { default: Math.PI / 4 }) fovYRadian!: number;

  @Column("float", { default: -1 }) orthographicLeft!: number;
  @Column("float", { default: 1 }) orthographicRight!: number;
  @Column("float", { default: -1 }) orthographicBottom!: number;
  @Column("float", { default: 1 }) orthographicTop!: number;

  @ManyToOne(() => Project, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  project?: Project;

  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}
