import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UsersService } from './services/users.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css','./app.component.scss']
})

export class AppComponent implements OnInit {
  user$= this.userserv.currentUserProfile$
  @HostBinding('class') className ='';
  toggleontrol=new FormControl(false);
  title = 'Chat-App';
  isChecked:any=false
  mode:string='light_mode'

  constructor( private userserv:UsersService){}
  ngOnInit(): void {
    this.toggleontrol.valueChanges.subscribe(val=>{
      this.className= val? 'my-dark-theme':''
    })
  }
  changed(event:MatSlideToggleChange):void{
       this.mode=event.checked ? 'nightlight_round':'light_mode';
       document.body.classList.toggle('my-dark-theme')
  }
}

