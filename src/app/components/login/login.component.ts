import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  emaill!: string;
  pass!: string;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    public router: Router,
    public authService: AuthService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {}
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  mySubmit() {
    if (!this.loginForm.valid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    this.authService
      .login(email, password)
      .pipe(
        this.toast.observe({
          success: 'Logged in successfully',
          loading: 'Logging in...',
          error: 'email or password is wrong',
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }

  onClick(){
    ( this.authService.loginwithgoogle()).pipe(
     this.toast.observe({
       success:'Logged in successfully',
       loading:'Logging in...',
       error:({message})=>`${message}`
     })
    ).subscribe(()=>{
     this.router.navigate([''])
    }

    )

   }
}
