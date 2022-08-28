import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TrainingListRequestComponent} from './training-list-request.component';

describe('TrainingListRequestComponent', () => {
  let component: TrainingListRequestComponent;
  let fixture: ComponentFixture<TrainingListRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingListRequestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingListRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
