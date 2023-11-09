import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GettingStartedComponent } from './features/getting-started/getting-started.component';
import { HomePageContainerComponent } from './features/home-page/components/home-page-container/home-page-container.component';
import { QlikVisualizationComponent } from './features/qlik-visualization/qlik-visualization.component';
import { UnathorizedPageComponent } from './unathorized-page/unathorized-page.component';
import { AllowCookiesComponent } from './features/qlik-visualization/allow-cookies/allow-cookies.component';

const routes: Routes = [
  { path: '', title: 'Kalibr8', component: HomePageContainerComponent },
  {
    path: 'home',
    loadChildren: () => import('./features/home-page/home-page.module').then(m => m.HomePageModule)
  },
  {
    path: 'accounts',
    loadChildren: () => import('./features/accounts/accounts.module').then(m => m.AccountsModule)
  },
  {
    path: 'schedules',
    loadChildren: () => import('./features/schedules/schedules.module').then(m => m.SchedulesModule)
  },
  {
    path: 'labels',
    loadChildren: () => import('./features/labels/labels.module').then(m => m.LabelsModule)
  },
  {
    path: 'recommendations',
    loadChildren: () => import('./features/recommendations/recommendations.module').then(m => m.recommendationsModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'instance',
    loadChildren: () => import('./features/instance/instance.module').then(m => m.InstanceModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule)
  },
  {
    path: 'resources',
    loadChildren: () => import('./features/resources/resources.module').then(m => m.ResourcesModule)
  },
  { path: 'getting-started', component: GettingStartedComponent },
  {path: 'active-intelligence', component: QlikVisualizationComponent},
  {path: 'unauthorized', component: UnathorizedPageComponent},
  {path: 'allow-cookies', component: AllowCookiesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
