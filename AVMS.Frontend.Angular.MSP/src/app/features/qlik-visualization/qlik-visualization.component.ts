import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiError } from 'src/app/models/api-error';
import { catchError } from 'rxjs';
import { NotifierService } from 'src/app/shared/services/notifier.service';

@Component({
  selector: 'app-qlik-visualization',
  templateUrl: './qlik-visualization.component.html',
  styleUrls: ['./qlik-visualization.component.scss'],
})
export class QlikVisualizationComponent implements OnInit {
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Active Intelligence', url: '' },
  ];
  loginIdToken: any;
  decodedToken: any;
  privateKey: any;
  iframeSrcUrl: any;
  qlikToken: any;
  iframe_src!: SafeResourceUrl;
  usageChartIframe: any;
  refreshTokenInterval: any;
  qlik_csrf_token: any;
  appId: any;
  sheetId: any;
  noDataFound: boolean = false;
  constructor(
    private commonservice: CommonService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private spinnerService: NgxSpinnerService,
    private toaster: NotifierService
    ) { }

  ngOnInit() {
    const appID = localStorage.getItem('appID');
    const sheetID = localStorage.getItem('sheetID');
    if (appID && sheetID && sheetID != 'undefined' && appID != 'undefined') {
        this.appId = appID;
        this.sheetId = sheetID;
      this.getCSRFToken();
      } else {
        this.generateQlikToken();
      }
  }

  async generateQlikToken() {
    this.spinnerService.show();
    this.commonservice.generateQlikToken().pipe(
      catchError(err => {
        this.spinnerService.hide();
        const error = err.error as ApiError;
          this.toaster.showError('error', error.message.join('\n'));
        throw err;
      })
    ).subscribe(
      res => {
        this.qlikToken = res.data.qlik_jwt;
        var qlikinfo = res?.data?.qlik_app_info;
        if(qlikinfo && Object.keys(qlikinfo).length === 0) {
          this.noDataFound = true;
        } else {
        this.appId = qlikinfo?.qlik_app_id;
        this.sheetId = qlikinfo?.sheet_id;
        localStorage.setItem('qlik_jwt_token', this.qlikToken);
        localStorage.setItem('appID', this.appId);
        localStorage.setItem('sheetID', this.sheetId);
        this.handleAutomaticLogin();
        }
      }
    );
  }

  handleAutomaticLogin() {
    this.commonservice.loginQlikVisualization(this.qlikToken)
    .pipe(
      catchError(err => {
        this.spinnerService.hide();
        const error = err.error as ApiError;
        this.toaster.showError('error', error.message.join('\n'));
        throw err;
      })
    ).subscribe(
      res => {
        if(res.status === 200){
          this.getCSRFToken();
        }
      },
    );
  }

  getCSRFToken() {
    this.commonservice.getCSRFToken().pipe(
      catchError(err => {
        this.spinnerService.hide();
        const error = err.error as ApiError;
        this.toaster.showError('error', error.message.join('\n'));
        throw err;
      })
      ).subscribe(res => {
      this.qlik_csrf_token = res.headers.get('qlik-csrf-token');
      this.router.navigate(['/active-intelligence']);
      this.iframeSrc();
    });
  }

  iframeSrc() {
    this.spinnerService.show();
    setTimeout(()=>{
      this.spinnerService.hide();
    }, 1000);
    const currentDate = new Date();
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);
    const formattedDate =
    (yesterdayDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
    yesterdayDate.getDate().toString().padStart(2, '0') + '/' +
    yesterdayDate.getFullYear();
    const formattedYDate = this.formatDate(formattedDate);
    const srcUrl = this.commonservice.constructSrcUrl(this.appId, this.sheetId, formattedYDate);
    this.iframe_src = this.sanitizer.bypassSecurityTrustResourceUrl(srcUrl)as SafeResourceUrl;
    const iframe = document.getElementById('iframe') as HTMLIFrameElement;
    iframe.classList.add('iframeStyle');
  }

  formatDate(inputDate: string): string {
    const parts = inputDate.split('/');
    const day = parseInt(parts[1], 10).toString();
    const month = parseInt(parts[0], 10).toString();
    const year = parts[2];
    return `${month}/${day}/${year}`;
  }
}
