import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TrainingAddRequestComponent} from './training-add-request.component';

describe('TrainingAddRequestComponent', () => {
  let component: TrainingAddRequestComponent;
  let fixture: ComponentFixture<TrainingAddRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingAddRequestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingAddRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
