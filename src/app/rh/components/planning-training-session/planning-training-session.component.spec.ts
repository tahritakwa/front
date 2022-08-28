import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlanningTrainingSessionComponent} from './planning-training-session.component';

describe('PlanningTrainingSessionComponent', () => {
  let component: PlanningTrainingSessionComponent;
  let fixture: ComponentFixture<PlanningTrainingSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningTrainingSessionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningTrainingSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
