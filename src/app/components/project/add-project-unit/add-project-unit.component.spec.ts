import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectUnitComponent } from './add-project-unit.component';

describe('AddProjectUnitComponent', () => {
  let component: AddProjectUnitComponent;
  let fixture: ComponentFixture<AddProjectUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProjectUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
