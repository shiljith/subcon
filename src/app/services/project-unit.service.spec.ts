import { TestBed } from '@angular/core/testing';

import { ProjectUnitService } from './project-unit.service';

describe('ProjectUnitService', () => {
  let service: ProjectUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
