import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get stored user data
  getUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get username (first name or full name split)
  getUserName(): string {
    const user = this.getUser();
    return user?.name?.split(' ')[0]?.toLowerCase() || 'u';
  }
  getUserId(): string {
    const user = this.getUser();
    console.log('🚀 ~ AuthService ~ getUserId ~ user:', user);

    // try different possible property names
    const id = user?._id ?? user?.id ?? user?.userId ?? null;

    return id ?? '';
  }
}
