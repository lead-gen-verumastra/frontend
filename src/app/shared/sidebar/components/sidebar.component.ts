import {
  Component,
  effect,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../../../api.service';
import { ChatService } from '../../../chat/service/chat.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Chat } from '../../models/chats.models';
import { PreloaderComponent } from '../../preloader/components/preloader.component';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, PreloaderComponent],
  templateUrl: '../templates/sidebar.component.html',
  styleUrl: '../styles/sidebar.component.scss',
})
export class SidebarComponent {
  chats: Chat[] = [];
  activeChatId: number | null = null;
  menuOpen: null | number = null;
  @ViewChild('menuDropdown', { static: false }) menuDropdownRef!: ElementRef;
  sidebarOpen = false;
  isAllChats = false;

  chatsListLoad = false;

  constructor(
    private apiService: ApiService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chatService.activeChatId$.subscribe((id) => {
      this.activeChatId = id;
    });

    this.chatService.getChatList().subscribe((chatList) => {
      this.chats = chatList;
    });

    this.apiService.getChats(30, 0).subscribe((resp) => {
      this.chatService.setChatList(resp.chats);
      this.chats = resp.chats;
      this.isAllChats = false;
    });
  }

  toggleChatMenu(chatId: number, event: MouseEvent) {
    this.menuOpen === chatId
      ? (this.menuOpen = null)
      : (this.menuOpen = chatId);
    event.stopPropagation();
  }

  deleteChat(chatId: number, event: Event) {
     event.stopPropagation();
    this.apiService.deleteChat(chatId).subscribe((resp) => {
      this.chatService.deleteChatId(chatId);

      if (this.activeChatId === chatId) {
        this.router.navigate(['/'], {
          replaceUrl: true,
        });
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (
      this.menuOpen !== null &&
      this.menuDropdownRef &&
      !this.menuDropdownRef.nativeElement.contains(target)
    ) {
      this.menuOpen = null;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  onNewChatClick() {
    if (this.isMobile()) {
      this.closeSidebar();
    }
  }

  onChatClick() {
    if (this.isMobile()) {
      this.closeSidebar();
    }
  }

  private isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  onChatsScroll(event: Event) {
    const chatElement = event.target as HTMLElement;

    const scrollTop = chatElement.scrollTop;
    const scrollHeight = chatElement.scrollHeight;
    const clientHeight = chatElement.clientHeight;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight;

    if (isAtBottom && !this.isAllChats && !this.chatsListLoad) {
      this.loadMoreContent(chatElement);
    }
  }

  loadMoreContent(chatElement: HTMLElement) {
    this.chatsListLoad = true;
    this.apiService.getChats(50, this.chats[this.chats.length - 1].created_timestamp).subscribe(resp => {
       if (resp.chats.length < 50) {
        this.isAllChats = true;
      }
      this.chats.push(...resp.chats);
      this.chatService.setChatList( this.chats);

      const previousHeight = chatElement.scrollHeight;

      setTimeout(() => {
        const newHeight = chatElement.scrollHeight;
        const heightDifference = newHeight - previousHeight;
        chatElement.scrollTop = heightDifference;
       this.chatsListLoad = false;
      }, 0);
    })
  }
}
