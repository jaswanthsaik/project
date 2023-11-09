import { TestBed } from '@angular/core/testing';

import { AccountsHttpService } from './accounts-http.service';

describe('AccountsHttpService', () => {
  let service: AccountsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
