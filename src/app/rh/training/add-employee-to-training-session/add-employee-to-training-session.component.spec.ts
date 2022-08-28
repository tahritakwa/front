import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddEmployeeToTrainingSessionComponent} from './add-employee-to-training-session.component';

describe('AddEmployeeToTrainingSessionComponent', () => {
  let component: AddEmployeeToTrainingSessionComponent;
  let fixture: ComponentFixture<AddEmployeeToTrainingSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddEmployeeToTrainingSessionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeToTrainingSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
