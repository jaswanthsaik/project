import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { filter, Subject, Subscription, takeUntil } from 'rxjs';
import { LoginService } from './features/authentication/login.service';
import { CommonService } from './services/common.service';
import { HttpService } from './services/http.service';
import { SideNavService } from './shared/components/side-nav/side-nav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('sideNav') sideNav!: ElementRef;

  showLogin = true;
  subs = new Subscription();
  private readonly _destroying$ = new Subject<void>();
  loginInProgress = true;

  constructor(
    private sideNavService: SideNavService,
    private router: Router,
    private broadcastService: MsalBroadcastService,
    private authService: MsalService,
    private httpService: HttpService,
    private loginService: LoginService,
    private commonService: CommonService
  ) { }

  expandSideNav(menu: string): void {
    this.sideNavService.expandMenu(menu, this.sideNav);
  }

  dockMainMenu(): boolean {
    return this.sideNavService.isExpanded;
  }

  getTestData(): void {
    this.authService.acquireTokenSilent({ scopes: ['cdc787f0-b9f4-4ca0-af29-31154b657b40'], account: this.authService.instance.getAllAccounts()[0] }).subscribe(res => {
      console.error('acquireTokenSilent', res);
    });
    this.httpService.getTestData().subscribe(res => {
      console.log('test data', res);
    });
  }

  navigateToHome(): void {
    const routeSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        const path = url.split('/')[1];
        if (path) {
          this.sideNavService.navigateTo(path, false);
        }
      }
    });
    this.subs.add(routeSub);
  }

  ngOnInit(): void {
    if (!this.loginService.bypassLogin()) {
      this.broadcastService.inProgress$
        .pipe(
          filter((status: InteractionStatus) => status === InteractionStatus.None),
          takeUntil(this._destroying$)
        )
        .subscribe(() => {
          this.loginService.login();
        });
    }

    this.loginService.loginFinalized.pipe(filter(res => res === true), takeUntil(this._destroying$)).subscribe(() => {
      this.loginInProgress = false;
    });

    const sub = this.commonService.getTermsAndConditionsUserStatus().subscribe(res => {
      let acceptedTnC = res.data;
      if (!acceptedTnC) {
        this.commonService.getTermsAndConditions().subscribe(res => {
          let tcText = res.data.term_description
         this.commonService.showTermsAndConditions(tcText);
        })
      } else {
        this.navigateToHome();
      }
    });
    this.subs.add(sub);

    this.router.events
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
