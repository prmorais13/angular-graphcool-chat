import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  nameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  configs = {
    isLogin: true,
    actionText: 'Login',
    buttonActionText: 'Criar login'
  };

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);
    const operation: Observable<{ id: string; token: string }> = this.configs
      .isLogin
      ? this.authService.signinUser(this.loginForm.value)
      : this.authService.signupUser(this.loginForm.value);

    operation.subscribe(
      res => {
        console.log('Redirecionando... ', res);
      },
      error => console.error('Ocorreu um erro inesperado,', error),
      () => console.log('Observable completado.')
    );
  }

  get name(): FormControl {
    return this.loginForm.get('name') as FormControl;
  }

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  changeAction() {
    this.configs.isLogin = !this.configs.isLogin;
    this.configs.actionText = !this.configs.isLogin ? 'Criar login' : 'Login';
    this.configs.buttonActionText = !this.configs.isLogin
      ? 'Já tenho login'
      : 'Criar login';
    !this.configs.isLogin
      ? this.loginForm.addControl('name', this.nameControl)
      : this.loginForm.removeControl('name');
  }
}
