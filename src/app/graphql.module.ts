import { NgModule, Inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import { environment } from '../environments/environment';
import { StorageKeys } from './storage-keys';
import {
  GraphcoolConfig,
  graphcoolConfig,
  GRAPHCOOL_CONFIG
} from './core/providers/graphcool-config.provider';

const uri = graphcoolConfig.simpleAPI;

// const uri = 'https://api.graph.cool/simple/v1/ck15oskbz4ffe0163llxtv8k7'; // <-- add the URL of the GraphQL server here

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = window.localStorage.getItem(StorageKeys.AUTH_TOKEN);

  // console.log('Context: ', operation.getContext());

  operation.setContext({
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
  });

  // console.log('Context 2: ', operation.getContext());

  return forward(operation);
});

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
    link: ApolloLink.from([
      linkError,
      authMiddleware,
      httpLink.create({ uri })
    ]),
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
    // { provide: GRAPHCOOL_CONFIG, useValue: graphcoolConfig }
  ]
})
export class GraphQLModule {}
