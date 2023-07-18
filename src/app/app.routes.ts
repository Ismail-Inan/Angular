import { Routes } from '@angular/router';
import { AddUserItemComponent } from './components/add_item/add.user.item.component';
import { ShowUserItemComponent } from './components/show-user-item/show-user-item.component';
import { CompanyLoginComponent } from './components/company-login/company-login.component';
import { CompanyProfileComponent } from './components/company-profile-group/company-profile/company-profile.component';
import { CompanyEditComponent } from './components/company-edit/company-edit.component';
import { AccessGuardService } from './services/guard/access-guard.service';
import { HomeComponent } from './components/home-group/home/home.component';
import { ItemsOverviewComponent } from './components/item-overview-group/items-overview/items-overview.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { MyItemsComponent } from './components/my-items-group/my-items/my-items.component';
import { DashboardComponent } from './components/my-items-group/dashboard/dashboard.component';
import { MyItemsOverviewComponent } from './components/my-items-group/my-items-overview/my-items-overview.component';
import { StatisticsComponent } from './components/my-items-group/statistics/statistics.component';

export const APP_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },

    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'addUserItem',
        component: AddUserItemComponent,
        canActivate: [AccessGuardService]
    },
    {
        path: 'addUserItem/:id',
        component: AddUserItemComponent,
        canActivate: [AccessGuardService]
    },
    {
        path: 'itemsOverview',
        component: ItemsOverviewComponent
    },
    {
        path: 'itemsOverview/:category',
        component: ItemsOverviewComponent,
    },
    {
        path: 'companyLogin',
        component: CompanyLoginComponent,
        canActivate: [AccessGuardService]
    },
    {
        path: 'showItem/:id',
        component: ShowUserItemComponent
    },
    {
        path: 'editCompany',
        component: CompanyEditComponent,
        canActivate: [AccessGuardService]
    },
    {
        path: 'myItemsOverview',
        component: MyItemsOverviewComponent,
        canActivate: [AccessGuardService],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'statistics', component: StatisticsComponent },
            { path: 'myItems', component: MyItemsComponent }
        ]
    },
    {
        path: 'companyProfile/:id',
        component: CompanyProfileComponent
    },
    {
        path: '**',
        component: ErrorPageComponent
    },
    /* {
         path: 'addUserItem',
         loadComponent: () =>
             import('./user_item/add.user.item.component')
                 .then(m => m.AddUserItemComponent)
     },*/

    // Option 1: Lazy Loading another Routing Config
    /*{
        path: 'home',
        loadChildren: () =>
            import('./booking/flight-booking.routes')
                .then(m => m.FLIGHT_BOOKING_ROUTES)
    },*/

    // Option 2: Directly Lazy Loading a Standalone Component
    /*{
        path: 'next-flight',
        loadComponent: () => 
            import('./next-flight/next-flight.component')
                .then(m => m.NextFlightComponent)
    }*/
];