import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { vedtakResponse } from './mock/vedtakResponse';


const resolvers = {
  Query: {
    hello: () => 'world',
    vedtak: () => vedtakResponse
  },
};

const typeDefs = gql`
  type Vedtak {
    rammer: [Ramme]
    utbetalinger: [Utbetaling]
  }

  type Ramme {
    vedtakId: String
    virkningsdato: String
  }

  type Utbetaling {
    vedtakId: String
    fraOgMed: String
    tilOgMed: String
    sumUtbetalt: Int
  }

  type Query {
    hello: String
    vedtak: Vedtak
  }
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };