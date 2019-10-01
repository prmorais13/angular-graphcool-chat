import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    // private http: HttpClient,
    private apollo: Apollo
  ) {
    // this.createUser();
    this.allUsers();
  }

  // private apiUrl = 'https://api.graph.cool/simple/v1/ck15oskbz4ffe0163llxtv8k7';

  allUsers(): void {
    // const body = {
    //   query: `
    //     query {
    //       allUsers{
    //         id
    //         name
    //         email
    //       }
    //     }
    //   `
    // };
    // this.http
    // .post(this.apiUrl, body)
    // .subscribe(res => console.log('Query com HttpClient: ', res));

    this.apollo
      .query({
        query: gql`
          query {
            allUsers {
              id
              name
              email
            }
          }
        `
      })
      .subscribe(res => console.log('Query com ApolloClient:', res));
  }

  createUser(): void {
    // const body = {
    //   query: `
    //     mutation createNewUser($name: String!, $email: String!, $password: String!) {
    //       createUser(name: $name, email: $email, password: $password) {
    //         id
    //         name
    //         email
    //       }
    //     }
    //   `,
    //   variables: {
    //     name: 'Paulo Ricardo',
    //     email: 'ricardo06@gmail.com',
    //     password: 'Ricardo06'
    //   }
    // };

    // this.http
    //   .post(this.apiUrl, body)
    //   .subscribe(res => console.log('Mutation com HttpClient: ', res));

    this.apollo
      .mutate({
        mutation: gql`
          mutation createNewUser(
            $name: String!
            $email: String!
            $password: String!
          ) {
            createUser(name: $name, email: $email, password: $password) {
              id
              name
              email
            }
          }
        `,
        variables: {
          name: 'Ana Paula',
          email: 'anapaula09@gmail.com',
          password: 'Ana06'
        }
      })
      .subscribe(res => console.log('Mutation com ApolloClient', res));
  }
}
