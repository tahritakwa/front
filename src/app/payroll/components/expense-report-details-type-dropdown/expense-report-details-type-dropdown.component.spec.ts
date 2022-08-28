import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExpenseReportDetailsTypeDropdownComponent} from './expense-report-details-type-dropdown.component';

describe('ExpenseReportDetailsTypeDropdownComponent', () => {
  let component: ExpenseReportDetailsTypeDropdownComponent;
  let fixture: ComponentFixture<ExpenseReportDetailsTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseReportDetailsTypeDropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseReportDetailsTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
