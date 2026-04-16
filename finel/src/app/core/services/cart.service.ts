import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);

  cartCount = signal<number>(0);

  addProductToCart(prodId: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v2/cart`, {
      productId: prodId,
    });
  }
  getLoggedUserCart(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v2/cart`);
  }

  getCartData(): Observable<any> {
    return this.getLoggedUserCart();
  }

  removeProductItem(id: string):Observable<any>{
    return this.httpClient.delete(environment.baseUrl + `/api/v2/cart/${id}`);
  }

  updateCartCount(id:string, count:number):Observable<any>{
    return this.httpClient.put(environment.baseUrl + `/api/v2/cart/${id}`,{
      count:count,
    });
  }

  clearCart():Observable<any>{
    return this.httpClient.delete(environment.baseUrl + `/api/v2/cart`);
  }
}
