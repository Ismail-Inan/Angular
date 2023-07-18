import { Injectable } from '@angular/core';
import { AuthenticationRequest } from '../../models/authentication-request';
import { AuthenticationResponse } from '../../models/authentication-response';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from '../local_storage/local-storage.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly authUrl = `${environment.apiBaseUrl}/${environment.authUrl}`;

  private accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public accessToken$: Observable<string | null> = this.accessTokenSubject.asObservable();

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    const accessToken = localStorageService.getAccessToken();
    if (accessToken && !this.isTokenExpired(accessToken)) {
      this.accessTokenSubject.next(accessToken);
    } else {
      this.logout();
    }
  }

  getAvatar(): Observable<any> {
    return this.http.get<any>(`${this.authUrl}/avatar`, { headers: this.getAuthHeader() });
  }

  login(authRequest: AuthenticationRequest): Observable<AuthenticationResponse> {
    const url = `${this.authUrl}/authenticate`;

    return this.http.post<AuthenticationResponse>(url, authRequest)
      .pipe(
        tap((response: AuthenticationResponse) => {
          this.localStorageService.setAccessToken(response.accessToken);
          this.localStorageService.setRefreshToken(response.refreshToken);
          this.localStorageService.setCompany(response.companyDTO);
          this.accessTokenSubject.next(response.accessToken);
        })
      );
  }

  public refreshToken(): Observable<any> {
    const url = `${this.authUrl}/refresh-token`;
    const refreshToken = this.localStorageService.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError('Refresh token not found');
    }
    return this.http.post<AuthenticationResponse>(url, { refresh_token: refreshToken })
      .pipe(
        tap((response: AuthenticationResponse) => {
          this.handleAuthenticationRespons(response);
        })
      );
  }

  logout() {
    this.localStorageService.removeAccessToken();
    this.localStorageService.removeAccessToken();
    this.accessTokenSubject.next(null);
  }

  public handleAuthenticationRespons(response: AuthenticationResponse) {
    this.localStorageService.setAccessToken(response.accessToken);
    this.localStorageService.setRefreshToken(response.refreshToken);
    this.localStorageService.setCompany(response.companyDTO);
    this.accessTokenSubject.next(response.accessToken);
  }

  isAuthenticated(): boolean {
    const token = this.localStorageService.getAccessToken();
    console.log("token=" + token);
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    const expirationDate = this.getTokenExpirationDate(token);
    return expirationDate && expirationDate < new Date();
  }

  private getTokenExpirationDate(token: string): Date | null {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken || !decodedToken.exp) {
      return null;
    }
    const expirationTimestamp = decodedToken.exp * 1000;
    return new Date(expirationTimestamp);
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(window.atob(base64));
      return decodedToken;
    } catch (error) {
      return null;
    }
  }

  getAuthHeader(): HttpHeaders {
    const token = this.localStorageService.getAccessToken();

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}