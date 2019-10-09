import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router'
import { Observable } from 'rxjs'

import { AuthService } from '../core/services/auth.service'
import { LoginModule } from './login.module'

@Injectable()
export class AutoLoginGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log('AuthLoginGuard')
    return this.authService.isAuthenticated$
  }
}
