import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap } from 'rxjs-compat/operators/switchMap';
import { AuthService } from 'src/app/services/auth.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  hide: boolean = true;
  user$ = this.authService.currentUser$;

  signUpForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmpassword: new FormControl('', [Validators.required]),
    },
    {
      validators: this.passwordMatch('password', 'confirmpassword'),
    }
  );
  constructor(
    private fb: FormBuilder,
    public router: Router,
    public authService: AuthService,
    private toast: HotToastService,
    private imageserv: ImageUploadService,
    private userserv: UsersService
  ) {}

  ngOnInit(): void {}
  get f() {
    return this.signUpForm.controls;
  }
  get name() {
    return this.signUpForm.get('name');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  get password() {
    return this.signUpForm.get('password');
  }
  get confirmpassword() {
    return this.signUpForm.get('confirmpassword');
  }
  mySubmit() {
    if (!this.signUpForm.valid) {
      return;
    }
    const { name, email, password } = this.signUpForm.value;
    this.authService
      .signup(email, password)
      .pipe(
        switchMap(({ user: { uid } }) =>
          this.userserv.addUser({ uid, email: email!, displayName: name! })
        ),
        this.toast.observe({
          success: 'You are sign Up successfully :)',
          loading: 'Signing up...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }
  passwordMatch(password: string, confirmPassword: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }
}
