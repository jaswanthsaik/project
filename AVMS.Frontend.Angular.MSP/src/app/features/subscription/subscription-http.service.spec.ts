import { TestBed } from '@angular/core/testing';

import { SubscriptionHttpService } from './subscription-http.service';

describe('SubscriptionHttpService', () => {
  let service: SubscriptionHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
