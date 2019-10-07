import { Injectable } from '@angular/core'
import { Apollo } from 'apollo-angular'
import { Observable, ReplaySubject } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  AUTHENTICATE_USER_MUTATION,
  SIGNUP_USER_MUTATION
} from './auth.graphql'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  /*
  Subject
  BehaviorSubject
  ReplaySubject
  */
  private _isAuthenticated = new ReplaySubject<boolean>(1)

  get isAuthenticated$(): Observable<boolean> {
    return this._isAuthenticated.asObservable()
  }

  signinUser(variables: {
    email: string
    password: string
  }): Observable<{ id: string; token: string }> {
    return this.apollo
      .mutate({
        mutation: AUTHENTICATE_USER_MUTATION,
        variables
      })
      .pipe(map((res: any) => res.data.authenticateUser))
  }

  signupUser(variables: {
    name: string
    email: string
    password: string
  }): Observable<{ id: string; token: string }> {
    return this.apollo
      .mutate({
        mutation: SIGNUP_USER_MUTATION,
        variables
      })
      .pipe(map((res: any) => res.data.signupUser))
  }
}
