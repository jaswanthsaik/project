import { Dialog } from '@angular/cdk/dialog';
import { ComponentPortal } from '@angular/cdk/portal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private closeModalDialogNotifier$ = new Subject();
  closeModalDialogNotifier = this.closeModalDialogNotifier$.asObservable();
  qlikurl = 'https://qnomwjd3u973b8f.eu.qlikcloud.com/login/jwt-session?qlik-web-integration-id=nVJKIACZcz5LdOgy3RappKJSxPDKrlr0';
  csrfToken = 'https://qnomwjd3u973b8f.eu.qlikcloud.com/api/v1/csrf-token?qlik-web-integration-id=nVJKIACZcz5LdOgy3RappKJSxPDKrlr0';
  generateQlikJwtToken = `${this.api}Qlik/v2/token`

  constructor(
    private loginService: LoginService,
    private http: HttpClient,
    private dialog: Dialog,
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

  showTermsAndConditions(): void {
    this.showWarning = false;
    this._showTermsAndConditions();
  }

  private _showTermsAndConditions(): void {
    // const data: ModalDialogData = {
    //   title: 'Terms and Conditions',
    //   primaryButtonText: 'ACCEPT',
    //   secondaryButtonText: '',
    //   cancelButtonText: 'DECLINE',
    //   portal: new ComponentPortal(TermsAndConditionsComponent)
    // };

    const sub = this.getTermsAndConditions().pipe(
      mergeMap(res => {
        this.tcText = res.data.term_description;
        const dialogRef = this.dialog.open<ModalDialogResponseOptions>(TermsAndConditionsComponent);
        return dialogRef.closed;
      }),
      mergeMap(confirmResult => {
        if (confirmResult === 'primary' && this.tcAccepted) {
          return this.acceptTermsAndConditionsUser();
        } else {
          return of(null);
        }
      })
    ).subscribe(result => {
      if (!result) {
        this.showWarning = true;
        this._showTermsAndConditions();
      } else {
        this.showGettingStarted = true;
        this.router.navigate(['/']);
      }
    });

  }

  closeModal(): void {
    this.closeModalDialogNotifier$.next(null);
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
