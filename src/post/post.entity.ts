import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('post')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('text')
  content: string;
}