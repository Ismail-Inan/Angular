import { Component, OnInit } from '@angular/core';
import { RouterLinkWithHref, RouterOutlet, RouterModule, NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { ErrorPageComponent } from '../error-page/error-page.component';
import { CommonModule } from '@angular/common';
import { ErrorService } from 'src/app/services/error/error.service';
import { Subscription } from 'rxjs';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [CommonModule, RouterOutlet, RouterLinkWithHref, RouterModule, NavigationComponent, FooterComponent, ErrorPageComponent],
  styleUrls: ['./app.component.css'],
  providers: [HttpClient],

})
export class AppComponent implements OnInit{
  showErrorMessage: boolean = false;
  private subscription: Subscription;

  
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.errorService.resetSharedValue();
      }
    });
    this.subscription = this.errorService.showErrorMessage$.subscribe(value => {
      this.showErrorMessage = value;
    });
  }

  constructor(private router: Router, public translationService: TranslationService, public errorService:ErrorService) {
    this.translationService.init();
  }

  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}