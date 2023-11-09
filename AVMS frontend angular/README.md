# Kalibr8 MSP Portal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.2.


## Development server

Run `ng serve --port 8057` for a dev server. Navigate to `http://localhost:8057/`. The application will automatically reload if you change any of the source files. To login to the system use the DEVELOP environment username and password.


## File naming conventions

  - See the [Angular naming convention guide](https://angular.io/guide/styleguide#naming) for more detail.
  - All new Typescript files should follow this naming convention. This makes it easier to search for and locate specific files.


# Styling Angular
  - Angular components should be written consistently - Inputs and Ouputs, followed by class variables, followed by constructor and then methods. Example:
```
export class AccountsContainerComponent implements OnInit {
  @Input() interval: number;

  constructor(
    private dashboardHttpService: DashboardHttpService,
    private actions$: Actions,
    private notifier: Notifier,
  ) {}

  ngOnInit() {
    this.dashboardHttpService.getInstanceGraph(interval).pipe(takeUntil(this._destroying$)).subscribe(res => {
      this.instanceGraphData = res.data;
      this.instanceGraphData = {...this.instanceGraphData};
    });
  }
```
  - Methods should roughly be in the order they are called - `ngOnChanges` and `ngOnInit` first, and `ngOnDestroy` last.
  - Angular lifecycle methods should be implemented in the component class declaration ex. `export class AccountsContainerComponent implements OnInit`
  - Always unsubscribe subscriptions in `ngOnDestroy`. If an individual subscription is not always initialized, check for existence before unsubscribing:
```
  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
```
