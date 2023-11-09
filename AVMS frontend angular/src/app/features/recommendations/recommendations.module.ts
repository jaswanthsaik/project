import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { recommendationsRoutingModule } from './recommendations-routing.module';
import { recommendationsContainerComponent } from './components/recommendations-container/recommendations-container.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecommendationDetailComponent } from './components/recommendations-popup/recommendations-popup.component';
import {MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import {MatChipsModule} from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  declarations: [
    recommendationsContainerComponent,
    RecommendationDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    recommendationsRoutingModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatChipsModule,
    MatDialogModule,
    NgxSpinnerModule
  ]
})
export class recommendationsModule { }
