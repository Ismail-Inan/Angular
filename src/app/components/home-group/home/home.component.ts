import { HttpClientModule } from '@angular/common/http';
import { ItemsGridComponent } from '../../item-overview-group/items-grid/items-grid.component';
import { NavigationComponent } from '../../navigation/navigation.component';
import { ItemsRowComponent } from "../items-row/items-row.component";
import { TranslateModule } from '@ngx-translate/core';
import { CompanyItemService } from 'src/app/services/company_item/company-item.service';
import { CompanyItemDTO } from 'src/app/models/company-item-dto';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage.service';
import { CommonModule } from '@angular/common';
import { ItemsFilterService } from 'src/app/services/company_item/items-filter.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RouterOutlet, RouterLinkWithHref, HttpClientModule, ItemsGridComponent,
    FormsModule, NavigationComponent, ItemsRowComponent, TranslateModule, CommonModule]
})
export class HomeComponent implements OnInit {
  latestItems: CompanyItemDTO[] = [];
  lastViewedItems: CompanyItemDTO[] = [];

  constructor(private searchTextService: ItemsFilterService,
    private _router: Router, private localStorageService: LocalStorageService,
    private userItemService: CompanyItemService, private cookieService: CookieService) {
  }

  ngOnInit() {
    this.latestItems = this.localStorageService.getNewestItems();

    if (!Array.isArray(this.latestItems) || !this.latestItems.length) { 
      this.userItemService.getLatestItems().subscribe(items => {
        this.latestItems = items;
      });
    }

    this.lastViewedItems = this.localStorageService.getLastViewedItems();
  }

  navigateToCategory(category: string): void {
    this._router.navigate(['/itemsOverview', category]);
  }

  goToItemsOverviewAndSearch(searchText?: string): void {
    console.log("goToItemsOverviewAndSearch" + searchText)
    this.searchTextService.setSearchText(searchText);
    this._router.navigate(['/itemsOverview']);
  }

  saveObjectToCookies(obj: any) {
    this.cookieService.set('newestItems', JSON.stringify(obj));
  }

  getObjectFromCookies(): any {
    const obj = this.cookieService.get('myObject');
    return JSON.parse(obj);
  }

}