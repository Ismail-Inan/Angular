import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { CompanyItemService } from 'src/app/services/company_item/company-item.service';
import { Page } from 'src/app/models/domain/page';
import { ApiResponse } from 'src/app/models/domain/api-response';
import { CompanyItemDTO } from 'src/app/models/company-item-dto';
import { LoadingService } from 'src/app/services/loading.service';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ItemsFilterService } from 'src/app/services/company_item/items-filter.service';
import { ItemsFilters } from 'src/app/models/company/items-filters';

@Component({
  selector: 'items-grid',
  standalone: true,
  templateUrl: './items-grid.component.html',
  imports: [CommonModule, RouterModule, HttpClientModule],
  providers: [CompanyItemService]
})
export class ItemsGridComponent implements OnInit {
  usersState$: Observable<{ appState: string, appData?: ApiResponse<Page>, error?: HttpErrorResponse }>;
  responseSubject = new BehaviorSubject<ApiResponse<Page>>(null);
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  category: string;

  public editUserItem: CompanyItemDTO;
  public deleteUserItem: CompanyItemDTO;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private userItemService: CompanyItemService,
    private itemsFilterService: ItemsFilterService,
    public loadingService: LoadingService,) { }

  ngOnInit() {
    this.itemsFilterService.filter$.subscribe(itemsFilters => {
      this.getItemsByFilter(itemsFilters);
    });

    this.route.params.subscribe((params) => {
      this.itemsFilterService.setCategory(params['category'] || 'ALL');
    });
  }

  showSelectedItem(userItem: any) {
    this.router.navigate(['/showItem', userItem.id]);
  }

  public onOpenModal(userItem: CompanyItemDTO, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addUserItemModal');
    }
    if (mode === 'edit') {
      this.editUserItem = userItem;
      button.setAttribute('data-target', '#updateUserItemModal');
    }
    if (mode === 'delete') {
      this.deleteUserItem = userItem;
      button.setAttribute('data-target', '#deleteUserItemModal');
    }
    container.appendChild(button);
    button.click();
  }

  public replaceImageUrl(url: string): string {
    return url.replace(/\\/g, '/').replace('uploads', '/assets');
  }

  public getItemsByFilter(filters: ItemsFilters, pageNumber: number = 0): void {

    console.log("searchUserItemsByFilter" + filters);
    console.log(filters);
    this.loadingService.loadingOn();

    this.usersState$ = this.userItemService.companyItems(filters, 0).pipe(
      map((response: ApiResponse<Page>) => {
        this.loadingService.loadingOff();
        this.responseSubject.next(response);
        this.currentPageSubject.next(pageNumber);
        console.log(response);
        return ({ appState: 'APP_LOADED', appData: response });
      }),
      startWith({ appState: 'APP_LOADED', appData: this.responseSubject.value }),
      catchError((error: HttpErrorResponse) => {
        this.loadingService.loadingOff();
        return of({ appState: 'APP_ERROR', error })
      }
      )
    )
  }

  goToPage(pageNumber: number): void {
    this.getItemsByFilter(this.itemsFilterService.getFilter(), pageNumber);
  }

  goToNextOrPreviousPage(direction?: string): void {
    this.getItemsByFilter(this.itemsFilterService.getFilter(),
      direction === 'forward'
        ? this.currentPageSubject.value + 1
        : this.currentPageSubject.value - 1,);
  }

}