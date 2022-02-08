import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

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
          localStorage.setItem('user', JSON.stringify(res.data));
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

  getUser() {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  isAdminAccess(): boolean {
    return this.getUser().role === 1 ? true : false;
  }

  logout() {
    localStorage.clear();
  }
}
