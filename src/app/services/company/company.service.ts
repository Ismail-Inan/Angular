import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompanyDTO } from 'src/app/models/company-dto';
import { CompanyUpdateRequest } from 'src/app/models/company/company-update-request';
import { AuthenticationService } from '../authentification/authentification.service';
import { LocalStorageService } from '../local_storage/local-storage.service';
import { AuthenticationResponse } from 'src/app/models/authentication-response';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private readonly companyUrl = `${environment.apiBaseUrl}/${environment.companyUrl}`;

  constructor(private http: HttpClient, private localStorageService: LocalStorageService,
    private authenticationService: AuthenticationService
  ) { }

  findAll(): Observable<CompanyDTO[]> {
    return this.http.get<CompanyDTO[]>(this.companyUrl);
  }

  getCompany(id: number): Observable<CompanyDTO> {
    return this.http.get<CompanyDTO>(`${this.companyUrl}/public/find/${id}`);
  }

  getMyCompany(): Observable<CompanyDTO> {
    return this.http.get<CompanyDTO>(`${this.companyUrl}/public/find/`);
  }

  deletCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.companyUrl}/${id}`);
  }

  updateCompany(id: number, company: CompanyDTO): Observable<CompanyDTO> {

    const storedCompany: CompanyDTO = this.localStorageService.getCompanyParsed();
    if (storedCompany && this.areCompanyFieldsEqual(storedCompany, company)) {
      return of(storedCompany);
    }

    return this.http.put<CompanyDTO>(`${this.companyUrl}/private/update/${id}`, company)
      .pipe(
        tap((response: CompanyDTO) => {
          console.log(response);
          this.localStorageService.setCompany(response);
        })
      );
  }

  private areCompanyFieldsEqual(company1: CompanyDTO, company2: CompanyDTO): boolean {
    return (
      company1.name === company2.name &&
      company1.address === company2.address
    );
  }

  setAvatar(selectedFile: File): Observable<void> {
    const formData = new FormData();
    formData.append('image', selectedFile);

    return this.http.post<void>(`${this.companyUrl}/private/avatar`, formData, { headers: this.authenticationService.getAuthHeader() });
  }

}