import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListMeetingExitEmployeeComponent} from './list-meeting-exit-employee.component';

describe('ListMeetingExitEmployeeComponent', () => {
  let component: ListMeetingExitEmployeeComponent;
  let fixture: ComponentFixture<ListMeetingExitEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListMeetingExitEmployeeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMeetingExitEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
