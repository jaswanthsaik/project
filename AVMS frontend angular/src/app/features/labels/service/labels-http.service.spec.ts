import { TestBed } from '@angular/core/testing';

import { LabelsHttpService } from './labels-http.service';

describe('LabelsHttpService', () => {
  let service: LabelsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LabelsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
