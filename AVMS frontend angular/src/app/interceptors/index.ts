import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpHeaderInterceptor } from './http-header.interceptor';
import { HttpErrorInterceptor } from './htttp-error.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpHeaderInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
];
