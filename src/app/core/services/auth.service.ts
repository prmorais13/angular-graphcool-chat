import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AUTHENTICATE_USER_MUTATION } from './auth.graphql';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) {
    this.signinUser({
      email: 'prmorais_13@hotmail.com',
      password: 'Paulo13'
    }).subscribe(res => console.log('Resposta signinUser: ', res));
  }

  signinUser(variables: {
    email: string;
    password: string;
  }): Observable<{ id: string; token: string }> {
    return this.apollo
      .mutate({
        mutation: AUTHENTICATE_USER_MUTATION,
        variables
      })
      .pipe(map(res => res.data.authenticateUser));
  }
}
