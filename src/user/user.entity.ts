import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

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
