import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly url = `${environment.apiBaseUrl}/item-statistic`;

  constructor(private http: HttpClient) {}

  trackItemVisit(itemId: number): Observable<void> {
    const trackVisitUrl = `${this.url}/public/${itemId}/increase-visit`;
    return this.http.post<void>(trackVisitUrl, null);
  }

  getItemViewsCount(itemId: number): Observable<number> {
    const viewsUrl = `${this.url}/private/${itemId}/views`;
    return this.http.get<number>(viewsUrl);
  }

}