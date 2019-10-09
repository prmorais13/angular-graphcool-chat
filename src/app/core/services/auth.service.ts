import { Injectable } from '@angular/core'
import { Apollo } from 'apollo-angular'

import { Observable, ReplaySubject, throwError, of } from 'rxjs'
import { map, tap, catchError, mergeMap } from 'rxjs/operators'

import { StorageKeys } from '../../storage-keys'

import {
  AUTHENTICATE_USER_MUTATION,
  SIGNUP_USER_MUTATION,
  LOGGED_IN_USER_QUERY,
  LoggedInUserQuery
} from './auth.graphql'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) {
    this.isAuthenticated$.subscribe(is => console.log('AuthState:', is))
    this.init()
  }
  /*
  Subject
  BehaviorSubject
  ReplaySubject
  */

  redirectUrl: string
  keepSigned: boolean
  private _isAuthenticated = new ReplaySubject<boolean>(1)

  init(): void {
    this.keepSigned = JSON.parse(
      window.localStorage.getItem(StorageKeys.KEEP_SIGNED)
    )
  }

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
      .pipe(
        map((res: any) => res.data.authenticateUser),
        tap(res =>
          this.setAuthState({
            token: res && res.token,
            isAuthenticated: res !== null
          })
        ),
        catchError(error => {
          this.setAuthState({ token: null, isAuthenticated: false })
          return throwError(error)
        })
      )
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
      .pipe(
        map((res: any) => res.data.signupUser),
        tap(res =>
          this.setAuthState({
            token: res && res.token,
            isAuthenticated: res !== null
          })
        ),
        catchError(error => {
          this.setAuthState({ token: null, isAuthenticated: false })
          return throwError(error)
        })
      )
  }

  toogleKeepSigned(): void {
    this.keepSigned = !this.keepSigned
    window.localStorage.setItem(
      StorageKeys.KEEP_SIGNED,
      this.keepSigned.toString()
    )
  }

  autoLogin(): Observable<any> {
    if (!this.keepSigned) {
      this._isAuthenticated.next(false)
      window.localStorage.removeItem(StorageKeys.AUTH_TOKEN)
      return of()
    }

    return this.validateToken().pipe(
      tap(authData => {
        const token = window.localStorage.getItem(StorageKeys.AUTH_TOKEN)
        this.setAuthState({ token, isAuthenticated: authData.isAuthenticated })
      }),
      mergeMap(res => of())
    )
  }

  private validateToken(): Observable<{
    id: string
    isAuthenticated: boolean
  }> {
    return this.apollo
      .query<LoggedInUserQuery>({
        query: LOGGED_IN_USER_QUERY
      })
      .pipe(
        map(res => {
          const user = res.data.loggedInUser
          return {
            id: user && user.id,
            isAuthenticated: user !== null
          }
        })
      )
  }

  private setAuthState(authData: {
    token: string
    isAuthenticated: boolean
  }): void {
    if (authData.isAuthenticated) {
      window.localStorage.setItem(StorageKeys.AUTH_TOKEN, authData.token)
    }
    this._isAuthenticated.next(authData.isAuthenticated)
  }
}
