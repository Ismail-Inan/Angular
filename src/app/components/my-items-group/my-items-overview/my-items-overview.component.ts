import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-items-overview',
  standalone: true,
  imports: [CommonModule, DashboardComponent, RouterModule],
  templateUrl: './my-items-overview.component.html',
  styleUrls: ['./my-items-overview.component.css']
})
export class MyItemsOverviewComponent {

}
