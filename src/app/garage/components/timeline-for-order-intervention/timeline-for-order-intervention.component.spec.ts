import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineForOrderInterventionComponent } from './timeline-for-order-intervention.component';

describe('TimelineForOrderInterventionComponent', () => {
  let component: TimelineForOrderInterventionComponent;
  let fixture: ComponentFixture<TimelineForOrderInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineForOrderInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineForOrderInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
