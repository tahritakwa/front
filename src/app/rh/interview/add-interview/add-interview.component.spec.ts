import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddInterviewPlanningComponent} from './add-interview.component';

describe('AddInterviewComponent', () => {
  let component: AddInterviewPlanningComponent;
  let fixture: ComponentFixture<AddInterviewPlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddInterviewPlanningComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInterviewPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
