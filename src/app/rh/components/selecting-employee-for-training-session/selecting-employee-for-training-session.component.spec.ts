import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SelectingEmployeeForTrainingSessionComponent} from './selecting-employee-for-training-session.component';

describe('SelectingEmployeeForTrainingSessionComponent', () => {
  let component: SelectingEmployeeForTrainingSessionComponent;
  let fixture: ComponentFixture<SelectingEmployeeForTrainingSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectingEmployeeForTrainingSessionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectingEmployeeForTrainingSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
