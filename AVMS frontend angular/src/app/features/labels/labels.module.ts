import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabelsRoutingModule } from './labels-routing.module';
import { LabelsContainerComponent } from './components/labels-container/labels-container.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddLabelComponent } from './components/add-label/add-label.component';
import { EditLabelComponent } from './components/edit-label/edit-label.component';
import { DeleteLabelComponent } from './components/delete-label/delete-label.component';
import { ScheduleLabelComponent } from './components/schedule-label/schedule-label.component';
import { LabelDetailsComponent } from './components/label-details/label-details.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    LabelsContainerComponent,
    AddLabelComponent,
    EditLabelComponent,
    DeleteLabelComponent,
    ScheduleLabelComponent,
    LabelDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LabelsRoutingModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    NgxSpinnerModule,
    MatDialogModule
  ]
})
export class LabelsModule { }
