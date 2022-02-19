import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { name: 'first_name' })
  firstName: string;

  @Column('text', { name: 'last_name' })
  lastName: string;

  @Column('text', { name: 'email' })
  email: string;

  @Column('text', { name: 'password' })
  password: string;

  @Column('boolean', { name: 'status', default: true })
  status: boolean;

  @Column('timestamp', { name: 'created_at', default: ()=> 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
