import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  isLogged = signal<boolean>(false);
  userName = signal<string>('');
  userEmail = signal<string>('');

  constructor() {
    this.decodeUserName();
  }

  decodeUserName(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('freshToken');
      const user = localStorage.getItem('freshUser');
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.userName.set(payload.name || '');
        } catch (e) {
          this.userName.set('');
        }
      }

      if (user) {
        try {
          const userData = JSON.parse(user);
          this.userEmail.set(userData.email || '');
          if (!this.userName()) this.userName.set(userData.name || '');
        } catch (e) {
          this.userEmail.set('');
        }
      }
    }
  }
  signOut(): void {
    localStorage.removeItem("freshToken");
    localStorage.removeItem("freshUser");
    this.isLogged.set(false);
    this.userName.set('');
    this.userEmail.set('');
    this.router.navigate(['/login']);
  }
  signUp(data:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl + "/api/v1/auth/signup", data)
  }

    signIn(data:object):Observable<any>{
      return this.httpClient.post(environment.baseUrl + "/api/v1/auth/signin", data)
    }

    forgotPassword(data:object):Observable<any>{
      return this.httpClient.post(environment.baseUrl + "/api/v1/auth/forgotPasswords", data)
    }
    verifyCode(data:object):Observable<any>{
      return this.httpClient.post(environment.baseUrl + "/api/v1/auth/verifyResetCode", data)
    }
    resetPassword(data:object):Observable<any>{
      return this.httpClient.put(environment.baseUrl + "/api/v1/auth/resetPassword", data)
    }

    updateUserData(data: object): Observable<any> {
      return this.httpClient.put(environment.baseUrl + '/api/v1/users/updateMe/', data);
    }

    updateUserPassword(data: object): Observable<any> {
      return this.httpClient.put(environment.baseUrl + '/api/v1/users/changeMyPassword', data);
    }
  }
