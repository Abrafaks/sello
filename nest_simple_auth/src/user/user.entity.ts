import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'firstName', length: 80, nullable: false })
  firstName: string;

  @Column({ name: 'lastName', length: 80, nullable: false })
  lastName: string;

  @Column({ name: 'email', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ name: 'password', length: 255, nullable: false })
  password: string;

  @Column({ name: 'phoneNumber', nullable: false })
  phoneNumber: string;

  @Column({ name: 'shirtSize', type: 'int', nullable: false })
  shirtSize: number;

  @Column({ name: 'preferredTechnology', length: 80, nullable: false })
  preferredTechnology: string;
}
