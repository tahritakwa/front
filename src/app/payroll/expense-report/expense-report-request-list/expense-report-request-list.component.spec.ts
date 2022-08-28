import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExpenseReportRequestListComponent} from './expense-report-request-list.component';

describe('ExpenseReportRequestListComponent', () => {
  let component: ExpenseReportRequestListComponent;
  let fixture: ComponentFixture<ExpenseReportRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseReportRequestListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseReportRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
