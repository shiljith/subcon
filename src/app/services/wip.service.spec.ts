import { TestBed } from '@angular/core/testing';

import { WipService } from './wip.service';

describe('WipService', () => {
  let service: WipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
