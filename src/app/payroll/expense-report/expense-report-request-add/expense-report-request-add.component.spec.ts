import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExpenseReportRequestAddComponent} from './expense-report-request-add.component';

describe('PurchaseRequestAddComponent', () => {
  let component: ExpenseReportRequestAddComponent;
  let fixture: ComponentFixture<ExpenseReportRequestAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseReportRequestAddComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseReportRequestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
