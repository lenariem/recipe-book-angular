import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { environment } from 'src/environments/environment';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  animations: [
    trigger('logoVerticalRotation', [
      state('rotateVertical', style({ transform: 'rotateX(0deg)' })),
      transition('* => rotateVertical', [
        animate('4s linear', style({ transform: 'rotateX(360deg)' })),
      ]),
    ]),
  ],
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  verticalRotationState = 'rotateVertical';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Start the vertical rotation animation when the component is initialized
    setTimeout(() => {
      this.verticalRotationState = 'rotateVertical';
    }, 0);
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      (resData) => {
        this.isLoading = false;
        this.error = null;
        this.router.navigate(['/recipes']);
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  onLoginWithTestUser() {
    const authObs: Observable<any> = this.authService.login(
      environment.testUserName,
      environment.testUserPassword
    );

    authObs.subscribe(
      (resData) => {
        this.isLoading = false;
        this.error = null;
        this.router.navigate(['/recipes']);
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
  }
}
