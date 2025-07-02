import { ProjectionType } from "@features/bananagl/camera/cameraInterface";
import type { ViewState } from "@features/bananagl/window/viewState";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Project } from "./project";

@Entity("saved_views")
export class SavedView {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column() name!: string;

  // Legacy fields for backward compatibility
  @Column("float", { array: true, nullable: true }) cameraPosition?: [number, number, number];
  @Column("float", { array: true, nullable: true }) cameraTarget?: [number, number, number];
  @Column({ type: "enum", enum: ProjectionType, nullable: true }) projectionType?: ProjectionType;
  @Column("float", { nullable: true }) fovYRadian?: number;
  @Column("float", { nullable: true }) orthographicZoomFactor?: number;
  @Column("float", { nullable: true }) canvasWidth?: number;
  @Column("float", { nullable: true }) canvasHeight?: number;

  // New serialized view state
  @Column("json", { nullable: true }) viewState?: ViewState;

  @ManyToOne(() => Project, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  project?: Project;

  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}
