import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { UsageInfoWidgetComponent } from './components/usage-info-widget/usage-info-widget.component';
import { SideWidgetComponent } from './components/side-widget/side-widget.component';
import { AvmsButtonComponent } from './components/avms-button/avms-button.component';
import { AvmsGaugeComponent } from './components/avms-gauge/avms-gauge.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { DialogModule } from '@angular/cdk/dialog';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { NgxEchartsModule } from 'ngx-echarts';
import { AvmsDropdownComponent } from './components/avms-dropdown/avms-dropdown.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableNavigationControlsComponent } from './components/table-navigation-controls/table-navigation-controls.component';
import { AvmsBreadcrumbsComponent } from './components/avms-breadcrumbs/avms-breadcrumbs.component';
import { AvmsDropdownLargeComponent } from './components/avms-dropdown-large/avms-dropdown-large.component';
import { ModalDialogComponent } from './components/dialogs/modal-dialog/modal-dialog.component';
import { SavingsChartComponent } from '../features/home-page/components/savings-chart/savings-chart.component';
import { CPUChartComponent } from '../features/home-page/components/cpu-chart/cpu-chart.component';
import { HalfDoughnutChartComponent } from '../features/home-page/components/half-doughnut-chart/half-doughnut-chart.component';
import { AvmsToggleComponent } from './components/avms-toggle/avms-toggle.component';
import { AvmsAutocompleteComponent } from './components/avms-autocomplete/avms-autocomplete.component';
import { AvmsDatePickerComponent } from './components/avms-date-picker/avms-date-picker.component';
import { AvmsFilterComponent } from './components/avms-filter/avms-filter.component';
import { AvmsSchedulerComponent } from './components/avms-scheduler/avms-scheduler.component';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { AvmsMultiSelectComponent } from './components/avms-multi-select/avms-multi-select.component';
import { ErrorDialogComponent } from './components/dialogs/error-dialog/error-dialog.component';
import { PreviewDialogComponent } from './components/dialogs/preview-dialog/preview-dialog.component';
import { AvmsBarChartComponent } from './components/avms-bar-chart/avms-bar-chart.component';
import { AvmsToasterComponent } from './components/avms-toaster/avms-toaster/avms-toaster.component';
import { AvmsToasterItemComponent } from './components/avms-toaster/avms-toaster-item/avms-toaster-item.component';
import { AvmsSearchComponent } from './components/avms-search/avms-search.component';
import { SearchInstanceComponent } from './components/search-instance/search-instance.component';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { FooterComponent } from './components/avms-footer/avms-footer.component';
import { AvmsDropdownSmallComponent } from './components/avms-dropdown-small/avms-dropdown-small.component';
import { ConfirmationDialogComponent } from './components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { NotifierService } from './services/notifier.service';
import { SaveNewFilterComponent } from './components/save-new-filter/save-new-filter.component';
import { DisableForSomeTimeDirective } from '../directive/disable-for-some-time.directive';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSelectFilterModule } from 'mat-select-filter';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    TitleBarComponent,
    SideNavComponent,
    TooltipComponent,
    UsageInfoWidgetComponent,
    SideWidgetComponent,
    AvmsButtonComponent,
    AvmsGaugeComponent,
    MainMenuComponent,
    AvmsDropdownComponent,
    TableNavigationControlsComponent,
    AvmsBreadcrumbsComponent,
    AvmsDropdownLargeComponent,
    ModalDialogComponent,
    SavingsChartComponent,
    CPUChartComponent,
    HalfDoughnutChartComponent,
    AvmsToggleComponent,
    AvmsAutocompleteComponent,
    AvmsDatePickerComponent,
    AvmsFilterComponent,
    AvmsSchedulerComponent,
    DropdownMenuComponent,
    TermsAndConditionsComponent,
    AvmsMultiSelectComponent,
    ErrorDialogComponent,
    PreviewDialogComponent,
    AvmsBarChartComponent,
    AvmsToasterComponent,
    AvmsToasterItemComponent,
    AvmsSearchComponent,
    SearchInstanceComponent,
    FooterComponent,
    AvmsDropdownSmallComponent,
    ConfirmationDialogComponent,
    SaveNewFilterComponent,
    DisableForSomeTimeDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    OverlayModule,
    DialogModule,
    DragDropModule,
    MatIconModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    // MatSelectFilterModule,
    MatCardModule,
    MatCheckboxModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  exports: [
    TitleBarComponent,
    SideNavComponent,
    UsageInfoWidgetComponent,
    SideWidgetComponent,
    AvmsButtonComponent,
    AvmsGaugeComponent,
    MainMenuComponent,
    AvmsDropdownComponent,
    TableNavigationControlsComponent,
    AvmsBreadcrumbsComponent,
    AvmsDropdownLargeComponent,
    AvmsDropdownSmallComponent,
    SavingsChartComponent,
    CPUChartComponent,
    HalfDoughnutChartComponent,
    TooltipComponent,
    AvmsToggleComponent,
    AvmsAutocompleteComponent,
    AvmsDatePickerComponent,
    AvmsFilterComponent,
    AvmsSchedulerComponent,
    AvmsMultiSelectComponent,
    OverlayModule,
    DialogModule,
    DragDropModule,
    FormsModule,
    ErrorDialogComponent,
    AvmsBarChartComponent,
    AvmsToasterComponent,
    AvmsToasterItemComponent,
    AvmsSearchComponent,
    SearchInstanceComponent,
    FooterComponent,
    ConfirmationDialogComponent,
    DisableForSomeTimeDirective
  ],
  providers: [
    NotifierService
  ]
})
export class SharedModule { }
