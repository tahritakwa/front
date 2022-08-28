import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TrainingSessionAddComponent} from './training-session-add.component';

describe('TrainingSessionAddComponent', () => {
  let component: TrainingSessionAddComponent;
  let fixture: ComponentFixture<TrainingSessionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingSessionAddComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingSessionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
