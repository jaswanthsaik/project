import { TestBed } from '@angular/core/testing';

import { InstanceHttpService } from './instance-http.service';

describe('InstanceHttpService', () => {
  let service: InstanceHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstanceHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
