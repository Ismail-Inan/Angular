import { Component } from '@angular/core';
import { RouterLinkWithHref, RouterOutlet, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'routing-component',
  standalone: true,
  templateUrl: './routing.component.html',
  imports: [RouterOutlet, RouterLinkWithHref, RouterModule],
  providers: [HttpClient],
  
})
export class RoutingComponent {


}