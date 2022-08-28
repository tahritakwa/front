import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TrainingRequestShowComponent} from './training-request-show.component';

describe('TrainingRequestShowComponent', () => {
  let component: TrainingRequestShowComponent;
  let fixture: ComponentFixture<TrainingRequestShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingRequestShowComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingRequestShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
