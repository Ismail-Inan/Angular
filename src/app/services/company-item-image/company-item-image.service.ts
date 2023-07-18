import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyItemImage } from 'src/app/models/company/company-item-image';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyItemImageService {
  private readonly url = environment.apiBaseUrl + "/company-item-image";

  constructor(private http: HttpClient) {}

  getCompanyImagesByItemId(itemId: number): Observable<CompanyItemImage[]> {
    const url = `${this.url}/public/${itemId}/all`;
    return this.http.get<CompanyItemImage[]>(url);
  }
}
