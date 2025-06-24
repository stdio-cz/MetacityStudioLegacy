import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Project } from "./project";
import { SavedView } from "./savedView";

@Entity("embeds")
export class Embed {
  @PrimaryGeneratedColumn() id!: number;

  @Column({ nullable: true }) name?: string;

  @Column() bucketName!: string;

  @ManyToOne(() => Project, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  project?: Project;

  @Column() thumbnailContents!: string;

  @Column({ default: false }) onlyTooltipInfo!: boolean;

  @ManyToMany(() => SavedView)
  @JoinTable({
    name: "embeds_saved_views_saved_views",
    joinColumn: {
      name: "embedsId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "savedViewsId",
      referencedColumnName: "id",
    },
  })
  savedViews?: SavedView[];

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
