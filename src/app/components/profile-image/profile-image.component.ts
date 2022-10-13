import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { User } from 'firebase/auth';
import { concatMap } from 'rxjs/internal/operators/concatMap';
import { ProfileUser } from 'src/app/models/user-profile';
import { AuthService } from 'src/app/services/auth.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { UsersService } from 'src/app/services/users.service';

@UntilDestroy()
@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.css']
})
export class ProfileImageComponent implements OnInit {
  user$ =this.userserv.currentUserProfile$;

  profileForm =new FormGroup({
      uid: new FormControl(''),
      email: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      displayName: new FormControl(''),
      photoURL: new FormControl(''),
      phone: new FormControl(''),
      address: new FormControl('')
  })
  constructor(public authService:AuthService , private toast:HotToastService , private imageserv:ImageUploadService , private userserv:UsersService) { }

  ngOnInit(): void {
    this.userserv.currentUserProfile$
    .pipe(untilDestroyed(this))
    .subscribe((user)=>{
      this.profileForm?.patchValue({...user});
    })
  }

  uploadImage(event:any , user:ProfileUser){

    this.imageserv.uploadImage(event.target.files[0], `images/ ${user.uid}`).pipe(
      this.toast.observe({
        success:'Image uploaded successfully :)',
        loading:'Image is being Uploaded...',
        error:({message})=>`${message}`
      }),
      concatMap((photoURL) =>
      this.userserv.updateUser({uid:user?.uid , photoURL}) )
    ).subscribe();

      }

  saveProfile(){
    // const profileData = this.profileForm.value;
    this.userserv.updateUser(this.profileForm!.value!).pipe(
      this.toast.observe({
        success:'Profile Updated successfully :)',
        loading:' being to Updated...',
        error:({message})=>`${message}`
      })
    ).subscribe();

  }

}
