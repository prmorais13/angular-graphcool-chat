import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'

import { MatSnackBar } from '@angular/material'

import { Observable } from 'rxjs'

import { AuthService } from '../../../core/services/auth.service'
import { ErrorService } from '../../../core/services/error.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup

  nameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ])

  configs = {
    isLogin: true,
    actionText: 'Login',
    buttonActionText: 'Criar login',
    isLoading: false
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.createForm()
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmit() {
    console.log(this.loginForm.value)
    this.configs.isLoading = true
    const operation: Observable<{ id: string; token: string }> = this.configs
      .isLogin
      ? this.authService.signinUser(this.loginForm.value)
      : this.authService.signupUser(this.loginForm.value)

    operation.subscribe(
      res => {
        console.log('Redirecionando... ', res)
        this.configs.isLoading = false
      },
      error => {
        console.error(error),
          this.snackBar.open(this.errorService.getErrorMessage(error), 'Done', {
            duration: 3000,
            verticalPosition: 'top'
          }),
          (this.configs.isLoading = false)
      },
      () => console.log('Observable completado.')
    )
  }

  get name(): FormControl {
    return this.loginForm.get('name') as FormControl
  }

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl
  }

  changeAction() {
    this.configs.isLogin = !this.configs.isLogin
    this.configs.actionText = !this.configs.isLogin ? 'Criar login' : 'Login'
    this.configs.buttonActionText = !this.configs.isLogin
      ? 'Já tenho login'
      : 'Criar login'
    !this.configs.isLogin
      ? this.loginForm.addControl('name', this.nameControl)
      : this.loginForm.removeControl('name')
  }
}
