import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyItemDTO } from '../../models/company-item-dto';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../models/domain/api-response';
import { Page } from '../../models/domain/page';
import { CompanyItemCategoryNode } from '../../models/user.item.category.node';
import { AuthenticationService } from '../authentification/authentification.service';
import { ItemsSidebarFilter } from 'src/app/models/items/items-sidebar-filter';

@Injectable({ providedIn: 'root' })
export class CompanyItemService {

  private readonly itemsUrl = environment.apiBaseUrl + "/company-item";

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  public getCompanyItems(title: string = '', page: number = 0, size: number = 10): Observable<CompanyItemDTO[]> {
    return this.http.get<CompanyItemDTO[]>(`${this.itemsUrl}/public/all?title=${title}&page=${page}&size=${size}`);
  }

  public getCompanyItemById(id: any): Observable<CompanyItemDTO> {
    return this.http.get<CompanyItemDTO>(`${this.itemsUrl}/public/find/${id}`);
  }

  public getItemsByCompanyId(companyId: number): Observable<CompanyItemDTO[]> {
    return this.http.get<CompanyItemDTO[]>(`${this.itemsUrl}/public/company/${companyId}`);
  }

  public getCategories(): Observable<CompanyItemCategoryNode[]> {
    return this.http.get<CompanyItemCategoryNode[]>(`${this.itemsUrl}/public/categories`);
  }

  public getLatestItems(): Observable<CompanyItemDTO[]> {
    return this.http.get<CompanyItemDTO[]>(`${this.itemsUrl}/public/latest`);
  }

  public companyItems(filter: ItemsSidebarFilter, page: number = 0, size: number = 12): Observable<ApiResponse<Page>> {
    const filterJson = JSON.stringify(filter);
    const encodedFilter = encodeURIComponent(filterJson);
    return this.http.get<ApiResponse<Page>>(`${this.itemsUrl}/public/all/filtered?filter=${encodedFilter}&page=${page}&size=${size}`);
  }

  public createCompanyItem(userItem: CompanyItemDTO, images: File[]) {
    if (!images || images.length === 0) {
      throw new Error("Images array is empty");
    }

    const maxFileSize = 10 * 1024 * 1024; // 10 MB

    for (const file of images) {

      if (!file.type.startsWith("image/")) {
        throw new Error("Not a image");
      }

      if (file.size > maxFileSize) {
        throw new Error("File is too large");
      }
    }

    const formData = new FormData();

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    const url = `${this.itemsUrl}/private/create`;

    formData.append('title', userItem.title);
    formData.append('description', userItem.description);
    formData.append('giveAway', "" + userItem.giveAway);
    formData.append('price', userItem.price.toString());
    formData.append('category', userItem.category);

    console.log("authToken=" + localStorage.getItem('authToken'));

    return this.http.post<ApiResponse<Page>>(url, formData,
      { headers: this.authenticationService.getAuthHeader() });
  }

  public updateUserItem(userItem: CompanyItemDTO, images: File[]): Observable<CompanyItemDTO> {
    if (!images || images.length === 0) {
      throw new Error("Images array is empty");
    }

    const maxFileSize = 10 * 1024 * 1024; // 10 MB

    for (const file of images) {

      if (!file.type.startsWith("image/")) {
        throw new Error("Not a image");
      }

      if (file.size > maxFileSize) {
        throw new Error("File is too large");
      }
    }

    const formData = new FormData();

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    const url = `${this.itemsUrl}/private/update`;

    formData.append('userItemId', "" + userItem.id);
    formData.append('title', userItem.title);
    formData.append('description', userItem.description);
    formData.append('giveAway', "" + userItem.giveAway);
    formData.append('price', userItem.price.toString());
    formData.append('category', userItem.category);

    return this.http.put<CompanyItemDTO>(url, formData);
  }

  public deleteUserItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.itemsUrl}/private/delete/${itemId}`);
  }

  public getItemsFilter(category: string, searchText: string): Observable<number[]> {
    const params = new HttpParams()
      .set('category', category)
      .set('searchText', searchText);

    return this.http.get<number[]>(`${this.itemsUrl}/public/items-filter`, { params });
  }

  public getMinMaxPrices(category?: string, searchText?: string): Observable<{ first: number, second: number }> {
    const params = new HttpParams()
      .set('category', category || '')
      .set('searchText', searchText || '');

    return this.http.get<{ first: number, second: number }>(`${this.itemsUrl}/public/filter/min-max-price`, { params });
  }

}