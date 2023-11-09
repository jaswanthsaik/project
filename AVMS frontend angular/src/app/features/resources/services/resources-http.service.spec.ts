import { TestBed } from '@angular/core/testing';

import { ResourcesHttpService } from './resources-http.service';

describe('ResourcesHttpService', () => {
  let service: ResourcesHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcesHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
