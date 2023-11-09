
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { analytics } from './analytics.component';
import { analyticsRoutingModule } from './analytics.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';



@NgModule({
    declarations: [analytics],
    imports: [CommonModule,
        analyticsRoutingModule,
        FormsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        SharedModule]
})
export class analyticsModule { }
