import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExpenseReportDetailTypeComponent} from './expense-report-detail-type.component';

describe('ExpenseReportDetailTypeComponent', () => {
  let component: ExpenseReportDetailTypeComponent;
  let fixture: ComponentFixture<ExpenseReportDetailTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseReportDetailTypeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseReportDetailTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
