import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

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

  constructor(private fb: FormBuilder) {}

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
