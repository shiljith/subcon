import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WipTimelineComponent } from './wip-timeline.component';

describe('WipTimelineComponent', () => {
  let component: WipTimelineComponent;
  let fixture: ComponentFixture<WipTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WipTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WipTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
