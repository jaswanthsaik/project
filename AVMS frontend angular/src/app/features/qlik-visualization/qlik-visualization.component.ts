import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
// import { environment } from 'src/environments/environment';
import { BreadcrumbsItem } from 'src/app/shared/models/breadcrumbs-item';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-qlik-visualization',
  templateUrl: './qlik-visualization.component.html',
  styleUrls: ['./qlik-visualization.component.scss'],
})
export class QlikVisualizationComponent implements OnInit {
  breadcrumbs: BreadcrumbsItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Visual Analytics', url: '' }, 
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
  listofSheetId: any= [];
  constructor(
    private commonservice: CommonService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private spinnerService: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinnerService.show();
    this.generateQlikToken();
    this.refreshTokenInterval = setInterval(() => {
    this.generateQlikToken();
    }, 30 * 60 * 1000);
  }

  async generateQlikToken() {
    this.commonservice.generateQlikToken().subscribe(
      res => {
        this.qlikToken = res.data.qlik_jwt;
        var qlikinfo = res?.data?.qlik_app_info;
        this.appId = qlikinfo?.qlik_app_id;
        this.listofSheetId = qlikinfo?.sheets;
        this.sheetId = this.listofSheetId[0]?.sheet_id;
        localStorage.setItem('qlik_jwt_token', this.qlikToken);
        this.handleAutomaticLogin();
      }
    );
  }

  handleAutomaticLogin() {
    this.commonservice.loginQlikVisualization(this.qlikToken).subscribe(
      res => {
        this.getCSRFToken();
      }
    );
  }

  getCSRFToken() {
    this.commonservice.getCSRFToken().subscribe(res => {
      this.qlik_csrf_token = res.headers.get('qlik-csrf-token');
      this.router.navigate(['/visual-analytics']);
      this.iframeSrc();
    });
  }

  iframeSrc() {
    this.spinnerService.show();
    setTimeout(()=>{
      this.spinnerService.hide();
    }, 4000);
    const srcUrl = `https://qnomwjd3u973b8f.eu.qlikcloud.com/single/?appid=${this.appId}&sheet=${this.sheetId}&theme=horizon&opt=noselection&qlik-web-integration-id=nVJKIACZcz5LdOgy3RappKJSxPDKrlr0&qlik-csrf-token=${this.qlik_csrf_token}`; 
    this.iframe_src = this.sanitizer.bypassSecurityTrustResourceUrl(srcUrl)as SafeResourceUrl;
    const iframe = document.getElementById('iframe') as HTMLIFrameElement;
    iframe.classList.add('iframeStyle');
  }

  selectedChart(tab:any) {
    this.sheetId = tab.sheet_id;
    this.iframeSrc();
  }
}
