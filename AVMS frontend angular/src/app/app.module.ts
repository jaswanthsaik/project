import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

// Import MSAL and MSAL browser libraries. 
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

// Import the Azure AD B2C configuration 
import { msalConfig, protectedResources } from './features/authentication/auth-config';

// Import the Angular HTTP interceptor. 
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { httpInterceptorProviders } from './interceptors';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { LogoutConfirmationComponent } from './features/authentication/logout-confirmation/logout-confirmation.component';
import { GettingStartedComponent } from './features/getting-started/getting-started.component';
import { ToastrModule } from 'ngx-toastr';
import { DeleteConfirmationDialogComponent } from './features/instance/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { QlikVisualizationComponent } from './features/qlik-visualization/qlik-visualization.component';
import { UnathorizedPageComponent } from './unathorized-page/unathorized-page.component';
import { AllowCookiesComponent } from './features/qlik-visualization/allow-cookies/allow-cookies.component';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { manageByExceptionsModule } from './features/analytics/manageByExceptions.module';
import { CPUusageModule } from './features/analytics/CPUusage.component.module';
import { RecommendationsModule } from './features/analytics/Recommendations.component.module';
import { FinancialModule } from './features/analytics/Financial.component.module';
import { AnalyticsService } from './analytics.service';

@NgModule({
  declarations: [
    AppComponent,
    LogoutConfirmationComponent,
    GettingStartedComponent,
    DeleteConfirmationDialogComponent,
    QlikVisualizationComponent,
    UnathorizedPageComponent,
    AllowCookiesComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTabsModule,
    NgxSpinnerModule,
    manageByExceptionsModule,
    CPUusageModule,
    RecommendationsModule,
    FinancialModule,
    // Initiate the MSAL library with the MSAL configuration object
    MsalModule.forRoot(new PublicClientApplication(msalConfig),
      {
        // The routing guard configuration. 
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: protectedResources.todoListApi.scopes
        }
      },
      {
        // MSAL interceptor configuration.
        // The protected resource mapping maps your web API with the corresponding app scopes. If your code needs to call another web API, add the URI mapping here.
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          [protectedResources.todoListApi.endpoint, protectedResources.todoListApi.scopes]
        ])
      }),
      BrowserAnimationsModule
  ],
  providers: [
    /*{
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },*/
    httpInterceptorProviders,
    AnalyticsService,
    DatePipe
    //MsalGuard
  ],
  bootstrap: [
    AppComponent,
    MsalRedirectComponent
  ]
})
export class AppModule { }
