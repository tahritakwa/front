import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingReportingMenuJournalsComponent } from './accounting-reporting-menu-journals.component';

describe('AccountingReportingMenuJouranlsComponentComponent', () => {
  let component: AccountingReportingMenuJournalsComponent;
  let fixture: ComponentFixture<AccountingReportingMenuJournalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingReportingMenuJournalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingReportingMenuJournalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
