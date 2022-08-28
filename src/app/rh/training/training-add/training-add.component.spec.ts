import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TrainingAddComponent} from './training-add.component';

describe('TrainingAddComponent', () => {
  let component: TrainingAddComponent;
  let fixture: ComponentFixture<TrainingAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingAddComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
