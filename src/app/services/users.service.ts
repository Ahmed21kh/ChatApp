import { Injectable } from '@angular/core';
import {
  collectionData,
  doc,
  docData,
  Firestore,
} from '@angular/fire/firestore';
import { collection, query, setDoc, updateDoc } from 'firebase/firestore';
import { from, of } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { switchMap } from 'rxjs/operators';
import { ProfileUser } from '../models/user-profile';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authserv.currentUser$.pipe(
      switchMap((user: any) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.firestore, 'users', user?.uid);
        return docData!(ref) as Observable<ProfileUser>;
      })
    );
  }
  get allUsers$(): Observable<ProfileUser[]> {
    const ref = collection(this.firestore, 'users');
    const queryAll = query(ref);

    return collectionData(queryAll) as Observable<ProfileUser[]>;
  }

  constructor(private firestore: Firestore, private authserv: AuthService) {}

  addUser(user: ProfileUser): Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser | any): Observable<any> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(updateDoc(ref, { ...user }));
  }
}
