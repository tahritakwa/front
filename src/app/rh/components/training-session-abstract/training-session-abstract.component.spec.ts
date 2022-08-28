import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TrainingSessionAbstractComponent} from './training-session-abstract.component';

describe('TrainingSessionAbstractComponent', () => {
  let component: TrainingSessionAbstractComponent;
  let fixture: ComponentFixture<TrainingSessionAbstractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingSessionAbstractComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingSessionAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
