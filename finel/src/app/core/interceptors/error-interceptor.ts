import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(catchError((err) => {
    if (isPlatformBrowser(platformId)) {
      toastrService.error(err.error?.message || 'An error occurred','FreshCart',{progressBar:true, closeButton:true});
    }
    return throwError(() => err);
  }));
};
