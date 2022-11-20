import { ApolloServer } from 'apollo-server-express';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

export const apolloServer = new ApolloServer({ typeDefs, resolvers });
