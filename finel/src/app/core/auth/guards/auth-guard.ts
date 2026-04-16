import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const platformId = inject(PLATFORM_ID)

  if (isPlatformBrowser(platformId)) {
  if(localStorage.getItem('freshToken')){
    return true;
  }else{
    return router.parseUrl('/login');
  }
}else{
  return true;
}
};
