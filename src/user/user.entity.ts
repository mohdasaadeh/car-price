import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

import { Report } from '../report/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  afterInsert() {
    console.log('The user was inserted successfully with ID: ', this.id);
  }

  @AfterUpdate()
  afterUpdate() {
    console.log('The user was updated successfully with ID: ', this.id);
  }

  @AfterRemove()
  afterRemove() {
    console.log('The user was removed successfully with ID: ', this.id);
  }
}
