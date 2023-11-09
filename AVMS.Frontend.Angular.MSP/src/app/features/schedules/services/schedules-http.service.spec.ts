import { TestBed } from '@angular/core/testing';

import { SchedulesHttpService } from './schedules-http.service';

describe('SchedulesHttpService', () => {
  let service: SchedulesHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchedulesHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
