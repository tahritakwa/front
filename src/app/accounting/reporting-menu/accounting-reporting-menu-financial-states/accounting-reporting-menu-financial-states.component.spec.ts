import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingReportingMenuFinancialStatesComponent } from './accounting-reporting-menu-financial-states.component';

describe('AccountingReportingMenuFinancialStatesComponentComponent', () => {
  let component: AccountingReportingMenuFinancialStatesComponent;
  let fixture: ComponentFixture<AccountingReportingMenuFinancialStatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingReportingMenuFinancialStatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingReportingMenuFinancialStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
