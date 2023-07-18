import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Router, RouterModule } from '@angular/router';
import { CompanyDTO } from 'src/app/models/company-dto';
import { CompanyItemService } from 'src/app/services/company_item/company-item.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-my-items',
  standalone: true,
  imports: [CommonModule, DashboardComponent, RouterModule, TableModule, ButtonModule, ToastModule],
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css'],
  providers: [MessageService]
})
export class MyItemsComponent implements OnInit {
  items: any[];
  company: CompanyDTO;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private userItemService: CompanyItemService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.fetchItems(); 
  }

  fetchItems() {
    this.items = this.localStorageService.getMyItems();
    this.company = this.localStorageService.getCompanyParsed();

    if (!Array.isArray(this.items) || !this.items.length) { 
      this.userItemService.getItemsByCompanyId(this.company.id).subscribe(items => {
        console.log("CompanyProfileItemsComponent items=" + items);

        this.items = items;
      });
    }
  }

  public replaceImageUrl(url: string): string {
    return url.replace(/\\/g, '/').replace('uploads', '/assets');
  }

  editItem(userItem: any): void {
    this.router.navigate(['/addUserItem', userItem.id]);
  }

  deleteItem(userItem: any): void {
    this.userItemService.deleteUserItem(userItem).subscribe(
      data => {
        console.log("deleteItem data=" + data);
        this.localStorageService.removeItem(userItem);
        this.items = this.items.filter(item => item.id !== userItem.id);
        this.showSuccess("Angebot wurde gelöscht");
      },
      error => {
        console.log("deleteItem error=" + error);
        this.showError("Angebot konnte nicht gelöscht werden");
      }
    );
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Erfolgreich', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Fehler', detail: message });
  }

  showSelectedItem(userItem: any) {
    this.router.navigate(['/showItem', userItem.id]);
  }

  sortItemsBy(option: string): void {
    if (option === 'newest') {
      this.items.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    } else if (option === 'oldest') {
      this.items.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
    }
  }

}