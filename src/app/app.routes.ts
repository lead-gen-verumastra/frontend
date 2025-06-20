import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'chat/:id',
    loadChildren: () =>
      import('./chat/modules/chat.module').then((m) => m.ChatModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./chat/modules/chat.module').then((m) => m.ChatModule),
  },
];
