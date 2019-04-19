const { ApolloServer, gql } = require('apollo-server');
import 'reflect-metadata';
import { createConnection, getConnection } from 'typeorm';
import { User } from './entity/User';
import { Category } from './entity/Category';
import { Event } from './entity/Event';
import { Person } from './entity/Person';
// import { Category } from './entity/Category';
// import { Person } from './entity/Person';
// import { Event } from './entity/Event';
createConnection();
// createConnection()
//   .then(async connection => {
//     console.log('Inserting a new user into the database...');

//     // const category = new Category();
//     // category.title = 'Kids';
//     // category.description = 'my kids';

//     // const ellie = await Person.create(
//     //   {
//     //     firstName: 'Ellie',
//     //     lastName: 'Sooter',
//     //     description: 'this is a example'
//     //   },
//     //   connection
//     // );

//     // const event = Object.assign(new Event(), {
//     //   title: 'hardware store',
//     //   description: 'trip to hardware store',
//     //   people: [ellie]
//     // });

//     // await connection.manager.save(event);

//     // const user = new User();
//     // user.firstName = 'Timber';
//     // user.lastName = 'Saw';
//     // user.age = 25;
//     // await connection.manager.save(user);
//     // console.log('Saved a new user with id: ' + user.id);

//     // console.log('Loading users from the database...');
//     const events = await connection.manager.find(Event);
//     console.log('Loaded events: ', await events[0].people);

//     // console.log('Here you can setup and run express/koa/any other framework.');
//   })
//   .catch(error => console.log(error));

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type UserPayload {
    user: User
    error: String
  }

  type Category {
    id: ID!
    title: String!
    description: String!
    people: [Person!]
  }

  type CategoryPayload {
    category: Category
    error: String
  }

  type Event {
    id: ID!
    title: String!
    description: String!
    people: [Person!]
  }

  type EventPayload {
    event: Event
    error: String
  }

  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    category: Category!
    events: [Event!]
  }

  input EventInput {
    title: String!
    description: String!
  }

  input CategoryInput {
    title: String!
    description: String!
  }

  input PersonInput {
    firstName: String!
    lastName: String!
    category: CategoryInput!
    events: [EventInput!]
  }

  type PersonPayload {
    person: Person
    error: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    users: [User]
    categories: [Category]
    events: [Event]
    people: [Person]
  }

  type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      email: String!
    ): UserPayload
    createCategory(
      title: String!
      description: String!
      people: [PersonInput!]
    ): CategoryPayload
    createEvent(
      title: String!
      description: String!
      people: [PersonInput!]
    ): EventPayload
    createPerson(firstName: String!, lastName: String!): PersonPayload
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    users: (_obj, _args, _context) => {
      return getConnection().manager.find(User);
    },
    categories: (_obj, _args, _context) => {
      return getConnection().manager.find(Category);
    },
    events: (_obj, _args, _context) => {
      return getConnection().manager.find(Event);
    },
    people: (_obj, _args, _context) => {
      return getConnection().manager.find(Person);
    }
  },
  Mutation: {
    createUser: async (_obj, args, _context) => {
      try {
        const user = await User.create(args);
        return { user, errors: [] };
      } catch (err) {
        return { user: null, error: err.message };
      }
    },
    createCategory: async (_obj, args, _context) => {
      try {
        const category = await Category.create(args);
        return { category, errors: [] };
      } catch (err) {
        return { category: null, error: err.message };
      }
    },
    createEvent: async (_obj, args, _context) => {
      try {
        const event = await Event.create(args);
        return { event, errors: [] };
      } catch (err) {
        return { event: null, error: err.message };
      }
    },
    createPerson: async (_obj, args, _context) => {
      try {
        const person = await Person.create(args);
        return { person, errors: [] };
      } catch (err) {
        return { person: null, error: err.message };
      }
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
