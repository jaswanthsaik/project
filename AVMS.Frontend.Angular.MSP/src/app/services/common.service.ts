import { Dialog } from '@angular/cdk/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, mergeMap, Observable, of, Subject, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from '../features/authentication/login.service';
import { ApiResponse } from '../models/api-response';
import { TermsConditionsApiResponse } from '../models/terms-conditions-api-response';
import { ModalDialogComponent } from '../shared/components/dialogs/modal-dialog/modal-dialog.component';
import { ModalDialogData } from '../shared/components/dialogs/models/modal-dialog-data';
import { ModalDialogResponseOptions } from '../shared/components/dialogs/models/modal-dialog-reponse-options';
import { TermsAndConditionsComponent } from '../shared/components/terms-and-conditions/terms-and-conditions.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private companyId: number = 0;
  tcText = '';
  showWarning = false;
  tcAccepted = false;
  showGettingStarted = false;

  api = environment.baseLoginApiUrl;
  accountApi = environment.baseAccountApiUrl;
  resourceApi = environment.baseResourceApiUrl;
  reportApi = environment.baseReportApiUrl;
  version = environment.apiVersion;
  qlik_base_url = environment.qlik_baseUrl;

  private closeModalDialogNotifier$ = new Subject();
  closeModalDialogNotifier = this.closeModalDialogNotifier$.asObservable();
  qlikurl = `${this.qlik_base_url}/login/jwt-session?qlik-web-integration-id=nVJKIACZcz5LdOgy3RappKJSxPDKrlr0`;
  csrfToken = `${this.qlik_base_url}/api/v1/csrf-token?qlik-web-integration-id=nVJKIACZcz5LdOgy3RappKJSxPDKrlr0`;
  generateQlikJwtToken = `${this.api}Qlik/v2/info`;
  qlik_csrf_url = `${this.qlik_base_url}/sense/app/{appId}/sheet/{sheetId}/state/analysis/options/clearselections/select/DT_REFERENCE/[{yesterdayDate}]`;
  qlik_overview = `${this.qlik_base_url}/sense/app/{appId}/overview`;
  qlikWebIntegrationId = 'nVJKIACZcz5LdOgy3RappKJSxPDKrlr0';

  dialogRef!: MatDialogRef<TermsAndConditionsComponent>;
  constructor(
    private loginService: LoginService,
    private http: HttpClient,
    private dialog: Dialog,
    private dialog1: MatDialog,
    private router: Router
  ) { }

  getCompanyId(): number {
    if (!this.loginService.bypassLogin()) {
      return this.companyId;
    }
    return (localStorage.getItem('company') || 0) as number;
  }

  getTermsAndConditionsUserStatus(): Observable<ApiResponse<boolean>> {
    const url = `${this.accountApi}TermConditionUser/${this.version}`;
    return this.http.get(url) as Observable<ApiResponse<boolean>>;
  }

  getTermsAndConditions(): Observable<ApiResponse<TermsConditionsApiResponse>> {
    const url = `${this.accountApi}TermCondition/${this.version}/user`;
    return this.http.get(url) as Observable<ApiResponse<TermsConditionsApiResponse>>;
  }

  acceptTermsAndConditionsUser(): Observable<ApiResponse<number>> {
    const url = `${this.accountApi}TermConditionUser/${this.version}`;
    return this.http.post(url, {}) as Observable<ApiResponse<number>>;
  }

  showTermsAndConditions(tcText: string): void {
    this.showWarning = false;
    this._showTermsAndConditions(tcText);
  }

  _showTermsAndConditions(tcText: any) {
    this.dialogRef = this.dialog1.open(TermsAndConditionsComponent, {
      width: '610px',
      disableClose: true,
    });

    this.dialogRef.componentInstance.tcText = tcText;
    this.dialogRef.componentInstance.showWarning = false;
  }

  closeModal(): void {
    this.closeModalDialogNotifier$.next(null);
  }

  constructSrcUrl(appId: any, sheetId: any, yesterdayDate: any) {
    var baseUrl;
    if(appId && sheetId && sheetId != 'undefined' && appId != 'undefined') {
     baseUrl = this.qlik_csrf_url.replace("{appId}", appId).replace("{sheetId}", sheetId).replace("{yesterdayDate}", yesterdayDate);
    } else {
      baseUrl = this.qlik_overview.replace("{appId}", appId);
    }
    return baseUrl;
  }

  generateQlikToken(): Observable<ApiResponse<any>> {
    return this.http.get(this.generateQlikJwtToken) as Observable<ApiResponse<any>>;
  }

  loginQlikVisualization(token:any) {
      return this.http.post(this.qlikurl, null, {observe: 'response'});
  }

  getCSRFToken() {
    return this.http.get(this.csrfToken,{observe: 'response'});
  }
}
