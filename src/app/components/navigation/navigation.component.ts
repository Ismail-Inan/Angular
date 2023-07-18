import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentification/authentification.service';
import { MenuModule } from 'primeng/menu';
import { CompanyDTO } from 'src/app/models/company-dto';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage.service';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { PrimeNGConfig } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ErrorService } from 'src/app/services/error/error.service';

@Component({
  selector: 'navigation',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkWithHref, LanguageSelectorComponent, OverlayPanelModule,
    TranslateModule, MenuModule, MenubarModule, ButtonModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  providers: [HttpClient]
})
export class NavigationComponent implements OnInit {
  avatarUrl: string;
  company: CompanyDTO;
  authenticated: boolean;

  ngOnInit() {
    console.log("navigationbar ngOnInit")
    this.primengConfig.ripple = true;
  }

  constructor(
    private primengConfig: PrimeNGConfig, private authService: AuthenticationService, 
    private router: Router, private localStorageService: LocalStorageService) {
    this.authenticated = this.authService.isAuthenticated();
    console.log("navigationbar authenticated = " + this.authenticated)

    if (!this.authenticated) {
      return;
    }
    
    this.company = this.localStorageService.getCompanyParsed();
    if (this.company && this.company.profileImageId) {
      this.avatarUrl = this.replaceImageUrl(this.company.profileImageId);
    }

    console.log("avatarUrl = " + this.avatarUrl)
    console.log("company = " + this.company)
    console.log("company = " + this.localStorageService.getCompany())

  }

  openCompanyProfile() {
    this.router.navigate(['/companyProfile', this.company.id]);
  }

  public replaceImageUrl(url: string): string {
    return url.replace(/\\/g, '/').replace('uploads', '/assets');
  }

  logout() {
    this.authService.logout();
    console.log("logout");
    window.location.reload();
  }

  refreshPage() {

  }

}