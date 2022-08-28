import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlanningTrainingSessionSeanceComponent} from './planning-training-session-seance.component';

describe('PlanningTrainingSessionSeanceComponent', () => {
  let component: PlanningTrainingSessionSeanceComponent;
  let fixture: ComponentFixture<PlanningTrainingSessionSeanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningTrainingSessionSeanceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningTrainingSessionSeanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
