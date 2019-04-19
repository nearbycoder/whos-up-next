import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { getConnection } from 'typeorm';

interface IProps {
  email: string;
  firstName: string;
  lastName: string;
}

@Entity()
export class User {
  static create(props: IProps) {
    const user = Object.assign(new User(), props);
    return getConnection().manager.save(user);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
