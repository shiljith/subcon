import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProjectUnitComponent } from './view-project-unit.component';

describe('ViewProjectUnitComponent', () => {
  let component: ViewProjectUnitComponent;
  let fixture: ComponentFixture<ViewProjectUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProjectUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProjectUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
