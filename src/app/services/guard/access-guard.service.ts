import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from '../local_storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGuardService {

  constructor(private router: Router,
    private localStorageService: LocalStorageService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    console.log("in canActivate")

    if (route.routeConfig?.path === 'companyLogin') {
      if (this.hasToken()) {
        console.log("token valid");
        this.router.navigate(['home']);
        return false;
      }
      console.log("token invalid");
      return true;
    }

    if (this.hasToken()){
      console.log("token valid");
      return true;
    }

    this.router.navigate(['companyLogin']);
    console.log("token invalid");
    return false;
  }

  hasToken(): boolean {
    const token = this.localStorageService.getAccessToken();
    if (token) {
      const jwtHelper = new JwtHelperService();
      const isTokenNonExpired = !jwtHelper.isTokenExpired(token);
      if (isTokenNonExpired) {
        return true;
      }
    }
    return false;
  }
}