import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient);

  wishlistCount = signal<number>(0);
  wishlistItems = signal<string[]>([]);

  addProductToWishlist(prodId: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/wishlist`, {
      productId: prodId,
    });
  }

  getLoggedUserWishlist(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/wishlist`);
  }

  removeProductFromWishlist(id: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/api/v1/wishlist/${id}`);
  }
}
