import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Person } from './Person';
import { getConnection } from 'typeorm';

interface IProps {
  title: string;
  description: string;
  people?: Person[];
}

@Entity()
export class Category {
  static create(props: IProps) {
    const category = Object.assign(new Category(), props);
    return getConnection().manager.save(category);
  }

  static new(props: IProps) {
    const category = new Category();
    return Object.assign(category, props);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(type => Person, person => person.category)
  people: Promise<Person[]>;
}
