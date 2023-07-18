import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ItemsGridComponent } from '../items-grid/items-grid.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ItemsSidebarComponent } from '../items-sidebar/items-sidebar.component';
import { CompanyItemService } from 'src/app/services/company_item/company-item.service';
import { NavigationComponent } from '../../navigation/navigation.component';
import { TranslateModule } from '@ngx-translate/core';
import { ItemsSidebarFilter } from 'src/app/models/items/items-sidebar-filter';

@Component({
  selector: 'app-items-overview',
  standalone: true,
  templateUrl: './items-overview.component.html',
  styleUrls: ['./items-overview.component.css'],
  imports: [CommonModule, TranslateModule,
    RouterOutlet, RouterLinkWithHref, HttpClientModule, ItemsGridComponent,
    FormsModule, ItemsSidebarComponent, NavigationComponent],

  providers: [HttpClient, CompanyItemService]
})
export class ItemsOverviewComponent implements OnInit {
  category: string;
  filters: ItemsSidebarFilter;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.category = params['category'] || 'ALL'
    });
  }

}