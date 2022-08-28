import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TimesheetInformationsComponent} from './timesheet-informations.component';

describe('TimesheetInformationsComponent', () => {
  let component: TimesheetInformationsComponent;
  let fixture: ComponentFixture<TimesheetInformationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimesheetInformationsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
