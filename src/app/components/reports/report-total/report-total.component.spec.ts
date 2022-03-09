import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTotalComponent } from './report-total.component';

describe('ReportTotalComponent', () => {
  let component: ReportTotalComponent;
  let fixture: ComponentFixture<ReportTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTotalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
