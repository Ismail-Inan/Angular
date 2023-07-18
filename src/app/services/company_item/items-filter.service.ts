import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemsFilters } from 'src/app/models/company/items-filters';

@Injectable({
  providedIn: 'root'
})
export class ItemsFilterService {
  private filterSubject = new BehaviorSubject<ItemsFilters>(new ItemsFilters());
  public filter$ = this.filterSubject.asObservable();
  filter: ItemsFilters = new ItemsFilters();

  setSearchText(searchText: string) {
    this.filter.searchText = searchText;
    this.filterSubject.next(this.filter);
  }

  setCategory(category: string) {
    this.filter.category = category;
    this.filterSubject.next(this.filter);
  }

  setMinPrice(minPrice: number) {
    this.filter.minPrice = minPrice;
    this.filterSubject.next(this.filter);
  }

  setMaxPrice(maxPrice: number) {
    this.filter.maxPrice = maxPrice;
    this.filterSubject.next(this.filter);
  }

  setForFree(forFree: boolean) {
    this.filter.forFree = forFree;
    this.filterSubject.next(this.filter);
  }

  getFilter(): ItemsFilters {
    return this.filter;
  }

}