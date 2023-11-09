
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvmsBreadcrumbsComponent } from 'src/app/shared/components/avms-breadcrumbs/avms-breadcrumbs.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Financial } from './Financial.component';
import { FinancialRoutingModule } from './Financial.component.routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
    declarations: [Financial],
    imports: [CommonModule,
        FinancialRoutingModule,
        FormsModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        NgxChartsModule,
        SharedModule]
})
export class FinancialModule { }
