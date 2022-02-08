import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  login(credential: { username: string; password: string }) {
    return this.http.post(`${this.baseUrl}/user/login`, credential).pipe(
      map((res: any) => {
        if (res && res.success && res.data) {
          localStorage.setItem('token', res.data.token);
          return true;
        }
        throw new Error('Invalid username or password');
      })
    );
  }

  isLoggedIn() {
    const user = this.getUser();
    if (user) {
      return true;
    }
    return false;
  }

  getUser(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const user: User = jwt_decode(token);
    return user;
  }

  isAdminAccess(): boolean {
    return this.getUser()?.role === 1 ? true : false;
  }

  logout() {
    localStorage.clear();
  }

  getAuthToken() {
    return localStorage.getItem('token');
  }
}
