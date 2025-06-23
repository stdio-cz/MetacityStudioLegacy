import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Project } from "./project";

@Entity("saved_views")
export class SavedView {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column() name!: string;

  @Column("float", { array: true }) cameraPosition!: [number, number, number];
  @Column("float", { array: true }) cameraTarget!: [number, number, number];

  @ManyToOne(() => Project, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  project?: Project;

  @CreateDateColumn() created_at!: Date;
  @UpdateDateColumn() updated_at!: Date;
}
