import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyItemService } from 'src/app/services/company_item/company-item.service';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { debounceTime } from 'rxjs/operators';
import { timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyItemCategoryFilter } from 'src/app/models/category/company-item-category-filter';
import { CategoryService } from 'src/app/services/category/category.service';
import { ItemsFilterService } from 'src/app/services/company_item/items-filter.service';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'items-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, CheckboxModule, TreeModule],
  templateUrl: './items-sidebar.component.html',
  styleUrls: ['./items-sidebar.component.css']
})
export class ItemsSidebarComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<any>();
  @Output() messageEvent: EventEmitter<string> = new EventEmitter<string>();

  categoryFilter: CompanyItemCategoryFilter;
  minPrice: number;
  maxPrice: number;
  forFree: boolean;
  category: string;

  public searchText: string;
  itemsGrid: any;
  itemsSidebar: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemsFilterService: ItemsFilterService,
    private companyItemService: CompanyItemService,
    private categoryService: CategoryService) {

    this.itemsFilterService.filter$.subscribe(itemsFilters => {
      this.searchText = itemsFilters.searchText;
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.category = params['category'] || 'ALL'
      this.loadCategories();
      this.loadMinMaxPrices();
    });
  }

  selectCategory(category: string) {
    if (category == 'ALL') {
      this.router.navigate(['/itemsOverview']);
      return;
    }
    this.router.navigate(['/itemsOverview', category]);
  }

  setSearchText(searchText: string) {
    this.itemsFilterService.setSearchText(searchText);
  }

  setMinPrice(minPrice: number) {
    const refreshDelay = 1000;
    timer(refreshDelay)
      .pipe(debounceTime(refreshDelay))
      .subscribe(() => {
        this.itemsFilterService.setMinPrice(minPrice);
      });
  }

  setForFree(forFree: boolean) {
    this.itemsFilterService.setForFree(forFree);
  }

  setMaxPrice(maxPrice: number) {
    const refreshDelay = 1000;

    timer(refreshDelay)
      .pipe(debounceTime(refreshDelay))
      .subscribe(() => {
        this.itemsFilterService.setMaxPrice(maxPrice);
      });
  }

  search(text?: string) {
    this.messageEvent.emit(text);
  }

  loadCategories() {
    this.categoryService.getCategoryFilters(this.category ? this.category : 'ALL')
      .subscribe((categoryFilter: CompanyItemCategoryFilter) => {
        this.categoryFilter = categoryFilter;
      });
  }

  loadMinMaxPrices(): void {
    this.companyItemService.getMinMaxPrices(null, this.searchText).subscribe(
      (response) => {
        this.minPrice = response.first;
        this.maxPrice = response.second;
      }
    );
  }

}