import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '../components/chat.component';
import { ChatRoutingModule } from './chat.routing-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreloaderComponent } from '../../shared/preloader/components/preloader.component';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PreloaderComponent,
  ],
})
export class ChatModule {}
