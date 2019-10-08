import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import {
  AUTHENTICATE_USER_MUTATION,
  SIGNUP_USER_MUTATION
} from './auth.graphql';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) {
    this.isAuthenticated$.subscribe(is => console.log('AuthState:', is));
  }

  /*
  Subject
  BehaviorSubject
  ReplaySubject
  */

  redirectUrl: string;
  private _isAuthenticated = new ReplaySubject<boolean>(1);

  get isAuthenticated$(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
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
      .pipe(
        map((res: any) => res.data.authenticateUser),
        tap(res => this.setAuthState(res !== null)),
        catchError(error => {
          this.setAuthState(false);
          return throwError(error);
        })
      );
  }

  signupUser(variables: {
    name: string;
    email: string;
    password: string;
  }): Observable<{ id: string; token: string }> {
    return this.apollo
      .mutate({
        mutation: SIGNUP_USER_MUTATION,
        variables
      })
      .pipe(
        map((res: any) => res.data.signupUser),
        tap(res => this.setAuthState(res !== null)),
        catchError(error => {
          this.setAuthState(false);
          return throwError(error);
        })
      );
  }

  private setAuthState(isAutehnticated: boolean): void {
    this._isAuthenticated.next(isAutehnticated);
  }
}
