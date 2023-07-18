import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { LocalStorageService } from '../local_storage/local-storage.service';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthenticationService } from './authentification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private localStorageService: LocalStorageService, private authenticationService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log("intercept");
    const authToken = this.localStorageService.getAccessToken();

    if (!authToken) {
      return next.handle(req);
    }

    console.log("has token")
    const authReq = this.addAuthorizationHeader(req, authToken);
    return next.handle(authReq).pipe(
      catchError((error) => {
        console.log("catchError")
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401
        ) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private addAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    console.log("addAuthorizationHeader");
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    return this.authenticationService.refreshToken().pipe(
      switchMap((response) => {
        return next.handle(this.addAuthorizationHeader(request, response.accessToken));
      }),
      catchError((error) => {
        console.log("logout")
        this.authenticationService.logout();

        return throwError(() => error);
      })
    );
  }

}