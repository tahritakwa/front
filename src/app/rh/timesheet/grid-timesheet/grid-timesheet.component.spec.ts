import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GridTimesheetComponent} from './grid-timesheet.component';

describe('GridTimesheetComponent', () => {
  let component: GridTimesheetComponent;
  let fixture: ComponentFixture<GridTimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GridTimesheetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
