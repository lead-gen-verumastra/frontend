import { BaseResponse } from './login.models';

export interface Chat {
  id: number;
  user_id: number;
  name: string;
  created_timestamp: number;
  last_message_timestamp?: number;
}

export interface CreateChatRequest {
  name: string;
}

export interface ChatResponse extends BaseResponse {
  chat: Chat;
}

export interface ChatsResponse extends BaseResponse {
  chats: Chat[];
}

export interface SendChatMessageRequest {
  text: string;
  previous_open_ai_response_id: string;
}

export enum ChatMessageType {
  Text = 0,
  myMessage = 1,
  MessageTypeAIProcessing = 2,
  MessageTypeAIFailed = 3,
  MessageTypeAIProcessed = 4,
}

export interface ChatMessageData {
  response_to_message_id: number;
  open_ai_response_id?: string;
}

export interface ChatMessage {
  id: number;
  chat_id: number;
  created_timestamp: number;
  type: ChatMessageType;
  text?: string;
  data?: ChatMessageData;
}

export interface ChatMessageResponse extends BaseResponse {
  message: ChatMessage;
}

export interface ChatMessagesResponse extends BaseResponse {
  messages: ChatMessage[];
}
