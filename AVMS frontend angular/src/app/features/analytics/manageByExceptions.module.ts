
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvmsBreadcrumbsComponent } from 'src/app/shared/components/avms-breadcrumbs/avms-breadcrumbs.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { manageByExceptions } from './manageByExceptions.component';
import { manageByExceptionsRoutingModule } from './manageByExceptions.routing.module';



@NgModule({
    declarations: [manageByExceptions],
    imports: [CommonModule,
        manageByExceptionsRoutingModule,
        FormsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        SharedModule]
})
export class manageByExceptionsModule { }
