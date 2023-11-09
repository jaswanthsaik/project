
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvmsBreadcrumbsComponent } from 'src/app/shared/components/avms-breadcrumbs/avms-breadcrumbs.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Recommendations } from './Recommendations.component';
import { RecommendationsRoutingModule } from './Recommendations.component.routing.module';



@NgModule({
    declarations: [Recommendations],
    imports: [CommonModule,
        FormsModule,
        RecommendationsRoutingModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        SharedModule]
})
export class RecommendationsModule { }
