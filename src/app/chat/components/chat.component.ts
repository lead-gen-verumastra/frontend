import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { ChatService } from '../service/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, expand, Subscription, switchMap, takeWhile, timer } from 'rxjs';
import { LOGIN_SESSION_KEY } from '../../shared/constants/constants';
import {
  Chat,
  ChatMessage,
  ChatMessageData,
} from '../../shared/models/chats.models';

@Component({
  selector: 'app-chat',
  templateUrl: '../templates/chat.component.html',
  styleUrl: '../styles/chat.component.scss',
})
export class ChatComponent {
  inputValue = '';
  messageList: ChatMessage[] = [];
  textLoader = false;
  activeChatId: null | number = null;
  chats: Chat[] = [];

  chatListSubscription: Subscription | null = null;

  responseToMessageId: null | string = null;
  messageLoad = false;
  isAllMessage = false;
  chatsMessageMoreLoad = false;

  constructor(
    private apiService: ApiService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.activeChatId = id ? +id : null;
      this.chatService.setActiveChatId(id ? +id : null);

      if (this.activeChatId) {
        this.apiService.getChatMessages(this.activeChatId).subscribe((resp) => {
          if (resp.messages[0].data?.open_ai_response_id) {
            this.responseToMessageId =
              resp.messages[0].data!.open_ai_response_id!.toString();
          }
          this.messageList = resp.messages.reverse();
          this.scrollToBottom();
          this.isAllMessage = false;
        });
      }
    });

    this.chatListSubscription = this.chatService
      .getChatList()
      .subscribe((chatList) => {
        this.chats = chatList;
      });

    this.apiService
      .login({ email: 'mainuser@verumastra.com', password: '1_Nig8j£01v5' })
      .subscribe((resp) => {
        localStorage.setItem(LOGIN_SESSION_KEY, resp.token);
      });
  }

  ngOnDestroy(): void {
    this.chatListSubscription?.unsubscribe();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage() {
    if (this.messageLoad) return;

    if (this.activeChatId === null) {
      this.createNewChat();
    } else {
      this.messageList.push({
        ...this.messageList[this.messageList.length - 1],
        text: this.inputValue,
        id: this.messageList[this.messageList.length - 1].id + 1,
        type: 1,
        created_timestamp: new Date().getTime(),
      });
      this.sendingMessageToApi(false);
    }
  }

  createNewChat() {
    this.apiService.createChat(this.inputValue!).subscribe((resp) => {
      this.activeChatId = resp.chat.id;
      this.chatService.addNewChat(resp.chat);

      this.messageList.push({
        text: this.inputValue,
        id: 1,
        type: 1,
        created_timestamp: new Date().getTime(),
        chat_id: this.activeChatId,
      });
      this.sendingMessageToApi(true);
    });
  }

  sendingMessageToApi(isNewChat: boolean) {
    this.scrollToBottom();
    this.inputValue = '';
    this.messageLoad = true;

    this.apiService
      .sendMessage(this.activeChatId!, {
        text: this.messageList[this.messageList.length - 1].text!,
        previous_open_ai_response_id: this.responseToMessageId!,
      })
      .pipe(
        switchMap((resp) => {
          const messageId = resp.messages[resp.messages.length - 1].id;

          return this.apiService
            .getChatMessageById(this.activeChatId!, messageId)
            .pipe(
              expand((messageResp) => {
                const msgType = messageResp.message.type;
                if (msgType === 3 || msgType === 4) {
                  return EMPTY;
                }
                return timer(3000).pipe(
                  switchMap(() =>
                    this.apiService.getChatMessageById(
                      this.activeChatId!,
                      messageId
                    )
                  )
                );
              }),
              takeWhile(
                (msgResp) =>
                  msgResp.message.type !== 3 && msgResp.message.type !== 4,
                true
              )
            );
        })
      )
      .subscribe((resp) => {
        if (resp.message.type === 3 || resp.message.type === 4) {
          this.messageList.push(resp.message);
          this.messageLoad = false;
          this.scrollToBottom();

          if (isNewChat) {
            this.router.navigateByUrl(`/chat/${this.activeChatId}`);
          }
        }
      });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const container = document.querySelector('.main-content');
      if (container) {
        container.scroll({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 0);
  }

  scrollOnChat(event: Event) {
    const chatElement = event.target as HTMLElement;
    const scrollTop = chatElement.scrollTop;

    if (scrollTop === 0 && !this.isAllMessage && !this.chatsMessageMoreLoad) {
      this.loadMoreContent(chatElement);
    }
  }

  loadMoreContent(chatElement: HTMLElement) {
    this.chatsMessageMoreLoad = true;
    this.apiService.getChatMessages(this.activeChatId!, 30, this.messageList[0].id).subscribe(resp => {
      if (resp.messages.length < 30) {
        this.isAllMessage = true;
      }
      this.messageList.unshift(...resp.messages.reverse());
      const previousHeight = chatElement.scrollHeight;

      setTimeout(() => {
        const newHeight = chatElement.scrollHeight;
        const heightDifference = newHeight - previousHeight;
        chatElement.scrollTop = heightDifference;
        this.chatsMessageMoreLoad = false;
      }, 0);
    })
  }
}
