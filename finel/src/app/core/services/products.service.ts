import { inject, Injectable } from '@angular/core';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

export interface ProductCacheEntry {
  data: any;
  expiry: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);

  private memCache = new Map<string, Observable<any>>();

  private readonly DEFAULT_TTL = 10 * 60 * 1000;

  private generateCacheKey(url: string): string {
    return encodeURI(url);
  }

  private getPersistentCache(key: string): any | null {
    if (typeof localStorage !== 'undefined') {
      const cachedStr = localStorage.getItem(key);
      if (cachedStr) {
        try {
          const parsed: ProductCacheEntry = JSON.parse(cachedStr);
          if (parsed.expiry > Date.now()) {
            return parsed.data;
          }
          localStorage.removeItem(key);
        } catch (e) {
          
          localStorage.removeItem(key);
        }
      }
    }
    return null;
  }

  private setPersistentCache(key: string, data: any, ttl: number): void {
    if (typeof localStorage !== 'undefined') {
      const entry: ProductCacheEntry = {
        data,
        expiry: Date.now() + ttl,
      };
      localStorage.setItem(key, JSON.stringify(entry));
    }
  }

  private getWithCache(url: string, ttl: number = this.DEFAULT_TTL): Observable<any> {
    const key = this.generateCacheKey(url);

    if (this.memCache.has(key)) {
      return this.memCache.get(key)!;
    }

    const persistentData = this.getPersistentCache(key);
    if (persistentData) {
      const cachedObs = of(persistentData).pipe(shareReplay(1));
      this.memCache.set(key, cachedObs);
      return cachedObs;
    }

    const request$ = this.httpClient.get(url).pipe(
      tap((response) => this.setPersistentCache(key, response, ttl)),
      shareReplay(1)
    );

    this.memCache.set(key, request$);
    return request$;
  }

  getAllProducts(pageNum: number = 1, queryString: string = ''): Observable<any> {
    const url = queryString
      ? `${environment.baseUrl}/api/v1/products?page=${pageNum}&${queryString}`
      : `${environment.baseUrl}/api/v1/products?page=${pageNum}`;

    return this.getWithCache(url);
  }

  getSpecificProduct(productId: string): Observable<any> {
    const url = `${environment.baseUrl}/api/v1/products/${productId}`;
    return this.getWithCache(url);
  }

  clearAllCache(): void {
    this.memCache.clear();

    if (typeof localStorage !== 'undefined') {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('/api/v1/products')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    }
  }

  clearProduct(productId: string): void {
    const url = `${environment.baseUrl}/api/v1/products/${productId}`;
    const key = this.generateCacheKey(url);

    this.memCache.delete(key);

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
}
