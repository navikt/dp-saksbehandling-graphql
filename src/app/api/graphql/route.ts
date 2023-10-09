import { azure } from '@navikt/dp-auth/identity-providers';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { GraphQLError } from 'graphql';
import { vedtakResponse } from './mock/vedtakResponse';
import { TodosAPI } from './todos-api';
import { NextRequest } from 'next/server';
import { getSession, getVedtakOboToken } from './auth/auth.utils';
import { VedtakAPI } from './vedtak-api';

interface ContextValue {
  dataSources: {
    todosAPI: TodosAPI;
    vedtakAPI: VedtakAPI
  };
}

const resolvers = {
  Query: {
    hello: () => 'world',
    // @ts-ignore
    vedtak: async (_, { ident }: { ident: string }, { dataSources }: ContextValue) => {
      return dataSources.vedtakAPI.hentVedtak(ident);
    },
    // @ts-ignore
    todos: async (_, __, { dataSources }: ContextValue) => {
      return dataSources.todosAPI.getTodos();
    },

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

  type Todo {
    userId: Int
    id: Int
    title: String
    completed: Boolean
  }

  type Query {
    hello: String
    vedtak (ident: String!): Vedtak
    todos: [Todo]
  }
`;

const server = new ApolloServer<ContextValue>({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (request: NextRequest) => {

    try {
      const session = await getSession(request);
      const token = await getVedtakOboToken(session);

      const { cache } = server;

      return {
        dataSources: {
          todosAPI: new TodosAPI({ cache }),
          vedtakAPI: new VedtakAPI({ token, cache }),
        },
      };
    } catch (error) {
      throw new GraphQLError('Feil ved henting av sesjon', {

        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
          error,
        },
      });
    }

  }

});

export { handler as GET, handler as POST };