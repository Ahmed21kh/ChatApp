import { Injectable } from '@angular/core';
import {  signInWithEmailAndPassword ,Auth, authState ,createUserWithEmailAndPassword, updateProfile, UserInfo  } from '@angular/fire/auth';
import firebase from 'firebase/compat/app';
import { from, of } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { concatMap } from 'rxjs/operators';
import { switchMap } from 'rxjs-compat/operators/switchMap';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$ = authState(this.afAuth);

  constructor(public afAuth:Auth ,private ath: AngularFireAuth,
    private route: ActivatedRoute) { }
  login(username:any, password:any){
    return from(signInWithEmailAndPassword(this.afAuth, username, password))
    }
    logout(){
      return from(this.afAuth.signOut())
    }
    signup( email:any , password:any){
      return from(createUserWithEmailAndPassword(this.afAuth,email,password))
    }

  updateprofileData(profileData:Partial<UserInfo> ):Observable<any>{
    const user = this.afAuth.currentUser;
    return of(user).pipe(
      concatMap( user => {
        if(!user) throw new Error('Not Authenticated');
        return updateProfile(user , profileData )
      })
    )
  }

  loginwithgoogle() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    return from(
      this.ath.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    );
  }
  }

