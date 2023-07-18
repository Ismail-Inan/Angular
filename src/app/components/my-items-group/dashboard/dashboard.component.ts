import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { NgChartsModule } from 'ng2-charts';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { RouterModule } from '@angular/router';
import { CompanyItemService } from 'src/app/services/company_item/company-item.service';
import { LocalStorageService } from 'src/app/services/local_storage/local-storage.service';
import { CompanyDTO } from 'src/app/models/company-dto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule,
    NgChartsModule, BarChartComponent, LineChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  items: any[]; 
  company: CompanyDTO;

  constructor(
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
}