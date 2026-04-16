import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);
  getAllCategories(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories`);
  }

  getCategories(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories`);
  }

  getSpecificCategory(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories/${id}`);
  }

  getSubCategories(id: string): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}/api/v1/subcategories?category[in]=${id}`
    );
  }

  getSubBrand(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/brands/${id}`);
  }

  getSubProduct(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products/${id}`);
  }

  getSpecificSubCategory(id: string, sort: string = ''): Observable<any> {
    const url = sort 
      ? `${environment.baseUrl}/api/v1/subcategories/${id}?sort=${sort}`
      : `${environment.baseUrl}/api/v1/subcategories/${id}`;
    return this.httpClient.get(url);
  }
}
