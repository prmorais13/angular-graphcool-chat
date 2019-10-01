import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import { environment } from '../environments/environment';

const uri = 'https://api.graph.cool/simple/v1/ck15oskbz4ffe0163llxtv8k7'; // <-- add the URL of the GraphQL server here
const linkError = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

export function createApollo(httpLink: HttpLink) {
  return {
    // link: httpLink.create({ uri }),
    link: ApolloLink.from([httpLink.create({ uri }), linkError]),
    cache: new InMemoryCache(),
    connectToDevTools: !environment.production
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule {}
