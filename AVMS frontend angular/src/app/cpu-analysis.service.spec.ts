import { TestBed } from '@angular/core/testing';

import { CpuAnalysisService } from './cpu-analysis.service';

describe('CpuAnalysisService', () => {
  let service: CpuAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpuAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
