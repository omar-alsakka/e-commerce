import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

export interface HttpCacheEntry {
  url: string;
  response: HttpResponse<any>;
  expiry: number;
}

const cacheMap = new Map<string, HttpCacheEntry>();

const DEFAULT_TTL = 10 * 60 * 1000;

export const cacheInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {

  if (req.method !== 'GET') {
    return next(req);
  }

  if (req.url.includes('/cart') || req.url.includes('/wishlist')) {
    return next(req);
  }

  const cacheKey = req.urlWithParams;
  const cachedItem = cacheMap.get(cacheKey);

  if (cachedItem && cachedItem.expiry > Date.now()) {

    return of(cachedItem.response.clone());
  }

  if (cachedItem) {
    cacheMap.delete(cacheKey);
  }

  return next(req).pipe(
    tap((event) => {

      if (event instanceof HttpResponse) {
        cacheMap.set(cacheKey, {
          url: cacheKey,
          response: event.clone(),
          expiry: Date.now() + DEFAULT_TTL,
        });
      }
    })
  );
};
