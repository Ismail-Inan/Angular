import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompanyRegistrationRequest } from '../../models/company/company-registration-request';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {

    private readonly registrationUrl = `${environment.apiBaseUrl}/${environment.registrationUrl}`;

    constructor(private http: HttpClient) { }

    register(request: CompanyRegistrationRequest): Observable<void> {
        return this.http.post<void>(`${this.registrationUrl}/register`, request);
    }

    confirm(id: number | undefined): Observable<void> {
        return this.http.get<void>(`${this.registrationUrl}/register/${id}`);
    }

}