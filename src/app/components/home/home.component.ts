import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, of } from 'rxjs';
import { startWith } from 'rxjs-compat/operators/startWith';
import { map, switchMap, tap } from 'rxjs/operators';
import { ProfileUser } from 'src/app/models/user-profile';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UsersService } from 'src/app/services/users.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('endOfChat') endOfChat: ElementRef;

  user$ = this.userserv.currentUserProfile$;

  SearchControl = new FormControl('');
  chatListControl = new FormControl();
  messageControl = new FormControl('');

  users$ = combineLatest([
    this.userserv.allUsers$,
    this.user$,
    this.SearchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([users, user, searchString]) =>
      users.filter(
        (u) =>
          u.displayName!.toLowerCase().includes(searchString!.toLowerCase()) &&
          u.uid !== user!.uid
      )
    )
  );

  myChats$ = this.chatserv.myChats$;
  messages$ = this.chatListControl.valueChanges.pipe(
    map((value) => value[0]),
    switchMap((chatId) => this.chatserv.getChatMessages$(chatId)),
    tap(() => {
      this.scrollToBottom();
    })
  );
  selectedChat$ = combineLatest([
    this.chatListControl.valueChanges,
    this.myChats$,
  ]).pipe(map(([value, chats]) => chats.find((c) => c.id === value[0])));

  constructor(
    private authserv: AuthService,
    private userserv: UsersService,
    private chatserv: ChatService
  ) {}

  ngOnInit(): void {}

  createChat(otherUser: ProfileUser) {
    this.chatserv
      .isExistingChat(otherUser?.uid)
      .pipe(
        switchMap((chatId) => {
          if (chatId) {
            return of(chatId);
          } else {
            return this.chatserv.createChat(otherUser);
          }
        })
      )
      .subscribe((chatId) => {
        this.chatListControl.setValue([chatId]);
      });
  }

  sendMessage() {
    const message = this.messageControl.value;
    const selectedChatId = this.chatListControl.value[0];
    if (message && selectedChatId) {
      this.chatserv.addChatMessage(selectedChatId, message).subscribe(() => {
        this.scrollToBottom();
      });
      this.messageControl.setValue('');
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}
