import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentification/authentification.service';

import { MessageModule } from 'primeng/message';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RegistrationService } from 'src/app/services/registration/registration.service';
import { CompanyRegistrationRequest } from 'src/app/models/company/company-registration-request';

@Component({
  selector: 'app-company-login',
  standalone: true,
  imports: [CommonModule, NavigationComponent, ReactiveFormsModule, TranslateModule, 
    MessageModule],
  templateUrl: './company-login.component.html',
  styleUrls: ['./company-login.component.css']
})

export class CompanyLoginComponent {
  title: string = 'Registrieren oder Einloggen';
  errorMessage: string = '';
  submitted = false;
  registrationSucessfullySubmitted = false;
  loading = false;
  isLoginFormVisible: boolean = true;
  registerForm: FormGroup;
  loginForm: FormGroup;
  customer: CompanyRegistrationRequest = {};

  constructor(private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    private alertService: AlertService) {
    this.createForms();
  }

  createForms() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmitRegisterForm() {
    console.log("submit register");
    this.submitted = true;

    this.alertService.clear();

    if (this.registerForm.invalid) {
      return;
    }
    
    this.registrationService.register(this.registerForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.registrationSucessfullySubmitted = true;
          this.alertService.success('Registration successful', { keepAfterRouteChange: true });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
    console.log("registered");
  }

  onSubmitLoginForm() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.authenticationService.login(this.loginForm.value).subscribe({
      next: (authenticationResponse) => {      
        window.location.reload();
      },
      error: (err) => {
        this.translateService.get('loginErrorMessage').subscribe((message: string) => {
          this.errorMessage = message;
        });
      }
    });
  }

  toggleForms() {
    this.isLoginFormVisible = !this.isLoginFormVisible;
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.controls['password'];
    const confirmPassword = form.controls['confirmPassword'];

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ 'passwordMismatch': true });
    } else {
      confirmPassword.setErrors(null);
    }

    return password.value === confirmPassword.value ? null : { 'passwordsMatch': true };
  }

}