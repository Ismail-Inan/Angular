import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../../navigation/navigation.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompanyDTO } from '../../../models/company-dto';
import { CompanyService } from '../../../services/company/company.service';
import { CompanyRegistrationRequest } from '../../../models/company/company-registration-request';

import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { CompanyProfileAboutComponent } from '../company-profile-about/company-profile-about.component';
import { CompanyProfileItemsComponent } from '../company-profile-items/company-profile-items.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorService } from 'src/app/services/error/error.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, NavigationComponent,
    MatDialogModule,
    FormsModule,
    SidebarModule,
    CompanyProfileAboutComponent,
    CompanyProfileItemsComponent,
    ToastModule,
    ConfirmDialogModule],
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit, OnDestroy {
  editable = false;
  display = false;
  operation: 'create' | 'update' = 'create';
  companys: Array<CompanyDTO> = [];
  company: CompanyDTO;
  imageUrl: string;
  private routeSub: any;
  activeTab: string = 'images';

  constructor(
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    console.log("Company not found241")
    this.routeSub = this.route.params.subscribe(params => {
      const id: number = +params.id;
   
      if (!id || isNaN(+id)) {
        this.errorService.setShowErrorMessage(true);
        return;
      }

      this.companyService.getCompany(params.id).subscribe(
        (data: CompanyDTO) => {
          if (!data) {
            console.log("Company not found")
            this.errorService.setShowErrorMessage(true);
            return;
          }

          this.company = data;
          console.log("data found" + this.company.id)

          if(this.company.profileImageId){
            this.imageUrl = this.replaceImageUrl(this.company.profileImageId);
          }
          this.localStorageService.addToLastViewedCompanies(this.company);
        },
        (error) => {
          console.log("An error occurred while fetching the company:", error);
          this.errorService.setShowErrorMessage(true);
        }
      );

    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  public replaceImageUrl(url: string): string {
    return url.replace(/\\/g, '/').replace('uploads', '/assets');
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}