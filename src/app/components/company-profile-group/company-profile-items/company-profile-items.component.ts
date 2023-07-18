import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompanyItemDTO } from 'src/app/models/company-item-dto';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage.service';
import { CompanyItemService } from 'src/app/services/company_item/company-item.service';

@Component({
  selector: 'app-company-profile-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-profile-items.component.html',
  styleUrls: ['./company-profile-items.component.css']
})
export class CompanyProfileItemsComponent implements OnInit {
  items: CompanyItemDTO[] = [];
  @Input() companyId: number;

  constructor(private router: Router, private userItemService: CompanyItemService,
    private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    this.items = this.localStorageService.getMyItems();

    if (!Array.isArray(this.items) || !this.items.length) { 
      this.userItemService.getItemsByCompanyId(this.companyId).subscribe(items => {
        console.log("CompanyProfileItemsComponent items=" + items);

        this.items = items;
      });
    }
  }

  showSelectedItem(userItem: any) {
    console.log("navigate to showItem")
    this.router.navigate(['/showItem', userItem.id]);
  }

  public replaceImageUrl(url: string): string {
    return url.replace(/\\/g, '/').replace('uploads', '/assets');
  }

}