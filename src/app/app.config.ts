import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ApiService } from './api.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { UserInterceptor } from './shared/interceptor/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    ApiService,
    provideHttpClient(withInterceptors([UserInterceptor])),
  ],
};
