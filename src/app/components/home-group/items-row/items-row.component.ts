import { CommonModule } from '@angular/common';
import { CompanyItemDTO } from 'src/app/models/company-item-dto';
import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-items-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './items-row.component.html',
  styleUrls: ['./items-row.component.css']
})
export class ItemsRowComponent {

  @Input() title: any;
  @Input() items: CompanyItemDTO[] = [];

  constructor(private router: Router) {
  }

  showSelectedItem(userItem: any) {
    this.router.navigate(['/showItem', userItem.id]);
  }

  public replaceImageUrl(url: string): string {
    return url.replace(/\\/g, '/').replace('uploads', '/assets');
  }

}