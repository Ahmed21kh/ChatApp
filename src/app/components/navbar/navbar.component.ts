import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user$ =this.userserv.currentUserProfile$;
  @HostBinding('class') className ='';
  toggleontrol=new FormControl(false);

  constructor(public authService:AuthService , public toast:HotToastService, public router:Router, private userserv:UsersService) { }

  ngOnInit(): void {
    this.toggleontrol.valueChanges.subscribe(val=>{
      this.className= val? 'my-dark-theme':'my-light-theme'
    })
  }
 logout(){
  this.authService.logout().pipe(
    this.toast.observe({
      success:'You are logout successfully :)',
      loading:'Signing up...',
      error:({message})=>`${message}`
    })
  ).subscribe(()=>{

    this.router.navigate(['login'])
  })

 }
}
