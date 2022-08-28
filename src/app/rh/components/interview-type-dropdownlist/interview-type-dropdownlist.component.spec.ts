import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InterviewTypeDropdownlistComponent} from './interview-type-dropdownlist.component';

describe('InterviewTypeDropdownlistComponent', () => {
  let component: InterviewTypeDropdownlistComponent;
  let fixture: ComponentFixture<InterviewTypeDropdownlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InterviewTypeDropdownlistComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewTypeDropdownlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
