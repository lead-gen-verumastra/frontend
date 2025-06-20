import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { LoginI, LoginResponseI } from './shared/models/login.models';
import { ChatMessageResponse, ChatMessagesResponse, ChatResponse, ChatsResponse, SendChatMessageRequest } from './shared/models/chats.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly httpService: HttpClient) {}

  login(loginData: LoginI) {
    return this.httpService.post<LoginResponseI>(`${environment.URL}/login`, loginData);
  }

  createChat(chatName: string) {
    return this.httpService.post<ChatResponse>(`${environment.URL}/chats`, { name: chatName });
  }

  getChats(limit: number = 50, afterTimestamp: number) {
    const params: Record<string, string> = { limit: limit.toString() };

    if (afterTimestamp !== undefined) {
      params['after_timestamp'] = afterTimestamp.toString();
    }

    return this.httpService.get<ChatsResponse>(`${environment.URL}/chats`, {
      params
    });
  }

  getChatById(chatId: number) {
    return this.httpService.get<ChatResponse>(`${environment.URL}/chats/${chatId}`);
  }

  deleteChat(chatId: number) {
    return this.httpService.delete<ChatResponse>(`${environment.URL}/chats/${chatId}`);
  }

  sendMessage(chatId: number, message: SendChatMessageRequest) {
    return this.httpService.post<ChatMessagesResponse>(
      `${environment.URL}/chats/${chatId}/messages`,
      message
    );
  }

  getChatMessages(chatId: number, limit: number = 30, after_chat_message_id: number = 0) {
    return this.httpService.get<ChatMessagesResponse>(`${environment.URL}/chats/${chatId}/messages?limit=${limit}&after_chat_message_id=${after_chat_message_id}`);
  }

  getChatMessageById(chatId: number, messageId: number) {
    return this.httpService.get<ChatMessageResponse>(
      `${environment.URL}/chats/${chatId}/messages/${messageId}`
    );
  }
}
