import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageContainerComponent } from './components/home-page-container/home-page-container.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SavingsChartComponent } from './components/savings-chart/savings-chart.component';

import { NgxEchartsModule } from 'ngx-echarts';
import { HalfDoughnutChartComponent } from './components/half-doughnut-chart/half-doughnut-chart.component';
import { GettingStartedComponent } from './components/getting-started/getting-started.component';
import { SearchRecommendationComponent } from './components/search-recommendation/search-recommendation.component';
import {MatTabsModule} from '@angular/material/tabs';


@NgModule({
  declarations: [
    HomePageContainerComponent,
    GettingStartedComponent,
    SearchRecommendationComponent
    //SavingsChartComponent,
    //HalfDoughnutChartComponent,
  ],
  imports: [
    CommonModule,
    HomePageRoutingModule,
    SharedModule,
    MatTabsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ]
})
export class HomePageModule { }
