import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  token$ = this.tokenSubject.asObservable();

  isAuthenticated$ = this.token$.pipe(map((token) => !!token));

  constructor(private http: HttpClient, private router: Router, @Inject(DOCUMENT) private document: Document) {}

  login() {
    const cognitoLoginUrl = `https://${environment.cognito.domain}/login?client_id=${environment.cognito.clientId}&response_type=code&scope=openid&redirect_uri=${environment.cognito.redirectUri}`;
    window.location.href = cognitoLoginUrl;
  }

  handleRedirectCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      this.exchangeCodeForToken(code);
    }
  }

  private exchangeCodeForToken(code: string) {
    this.http.get<any>(`https://es-ua.ddns.net:444/api/token/get?code=${code}`).subscribe({
      next: (response) => {
        const tokenObject = JSON.parse(response.token);
        this.setToken(tokenObject.id_token);
      },
      error: (error) => {
        console.error('Token exchange failed:', error);
      }
    });
  }

  private setToken(token: string) {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token); 
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null); 
    const cognitoLogoutUrl = `https://${environment.cognito.domain}/logout?client_id=${environment.cognito.clientId}&logout_uri=${environment.cognito.logotUri}`;
    window.location.href = cognitoLogoutUrl;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
