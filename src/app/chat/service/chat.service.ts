import { Injectable} from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Chat } from "../../shared/models/chats.models";

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private _chatList: Chat[] = [];
  private _activeChatId = new Subject<number | null>();

  chatList = new BehaviorSubject<Chat[]>([]);
  activeChatId$ = this._activeChatId.asObservable();

  addNewChat(newChat: Chat) {
    this._chatList = [newChat, ...this._chatList];
    this.chatList.next(this._chatList);
  }

  getChatList(): Observable<Chat[]> {
    return this.chatList.asObservable();
  }

  setChatList(chatList: Chat[]) {
    this._chatList = [...chatList];
    this.chatList.next(this._chatList);
  }

  deleteChatId(chatId: number) {
    this._chatList = this._chatList.filter(chat => chat.id !== chatId);
    this.chatList.next(this._chatList);
  }

  setActiveChatId(id: number | null) {
    this._activeChatId.next(id);
  }

  clearActiveChatId() {
    this._activeChatId.next(null);
  }
}
