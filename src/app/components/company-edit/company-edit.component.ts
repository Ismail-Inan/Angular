import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationComponent } from '../navigation/navigation.component';
import { OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company/company.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage.service';
import { CompanyDTO } from 'src/app/models/company-dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AvatarComponent } from '../avatar/avatar.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { PasswordEditDialogComponent } from '../password-edit-dialog/password-edit-dialog.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-company-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationComponent,
    MatInputModule, ReactiveFormsModule, ToastModule,
    AvatarComponent, MatFormFieldModule, MatDialogModule,
    TranslateModule, NgbModule],
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.css'],
  providers: [MessageService]
})
export class CompanyEditComponent implements OnInit {
  companyId: number;
  company: CompanyDTO;
  editForm: FormGroup;
  imageUrl: string;
  selectedImage: File | null = null;
  nameMaxLength: number = 65;

  constructor(private messageService: MessageService,
    private companyService: CompanyService,
    private localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
    });

    var company = this.localStorageService.getCompanyParsed();
    if(company){
      this.company = company;
    }else{
      
    }
    this.companyId = this.localStorageService.getCompanyParsed().id;
    this.companyService.getCompany(this.companyId).subscribe((data: any) => {
      this.company = data;
      this.imageUrl = this.replaceImageUrl(this.company.profileImageId);

      this.editForm.patchValue({
        name: this.company.name,
        email: this.company.email,
        address: this.company.address,
      });
    });
  }

  public replaceImageUrl(url: string): string {
    return url.replace(/\\/g, '/').replace('uploads', '/assets');
  }

  openChangePasswordDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(PasswordEditDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // Handle dialog close event if needed
    });
  }

  onImageSelected(image: File | null) {
    this.selectedImage = image;
    // Do something with the selected image
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0] as File;
  }

  onSubmit() {
    this.companyService.updateCompany(this.companyId, this.editForm.value)
      .subscribe({
        next: () => {
          console.log('Company updated successfully');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
          this.ngOnInit();
        },
        error: error => {
          console.error('Error updating company:', error);
        }
      });
  }

}