import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsContainerComponent } from './components/accounts-container/accounts-container.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddAccountComponent } from './components/add-account/add-account.component';
import { AddAccountAzureComponent } from './components/add-account-azure/add-account-azure.component';
import { RemoveAccountComponent } from './components/remove-account/remove-account.component';
import { SavingsChartComponent } from '../home-page/components/savings-chart/savings-chart.component';
import { HalfDoughnutChartComponent } from '../home-page/components/half-doughnut-chart/half-doughnut-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { RefreshAccountComponent } from './components/refresh-account/refresh-account.component';
import { ApplyScheduleComponent } from './components/apply-schedule/apply-schedule.component';
import { ManageLabelComponent } from './components/manage-label/manage-label.component';
import { SubscriptionDetailsComponent } from './components/subscription-details/subscription-details.component';
import { SecureAccountComponent } from './components/secure-account/secure-account.component';
import { StartStopInstanceComponent } from './components/start-stop-instance/start-stop-instance.component';
import { ScaleInstanceComponent } from './components/scale-instance/scale-instance.component';
import { PostponeShutdownComponent } from './components/apply-schedule/postpone-shutdown/postpone-shutdown.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { ResourceGroupDetailsComponent } from './components/resource-group-details/resource-group-details.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    AccountsContainerComponent,
    AddAccountComponent,
    AddAccountAzureComponent,
    RemoveAccountComponent,
    AccountDetailsComponent,
    RefreshAccountComponent,
    ApplyScheduleComponent,
    ManageLabelComponent,
    SubscriptionDetailsComponent,
    SecureAccountComponent,
    StartStopInstanceComponent,
    ScaleInstanceComponent,
    PostponeShutdownComponent,
    ResourceGroupDetailsComponent
    //SavingsChartComponent,
    //HalfDoughnutChartComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatTabsModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    NgxSpinnerModule,
    MatDialogModule,
    FormsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    AccountsRoutingModule
  ]
})
export class AccountsModule { }
