import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Person } from './Person';
import { getConnection } from 'typeorm';

interface IProps {
  title: string;
  description: string;
  people?: Person;
}

@Entity()
export class Event {
  static create(props: IProps) {
    const event = Object.assign(new Event(), props);
    return getConnection().manager.save(event);
  }

  static new(props: IProps) {
    const event = new Event();
    return Object.assign(event, props);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(type => Person, person => person.events)
  @JoinTable()
  people: Promise<Person[]>;
}
