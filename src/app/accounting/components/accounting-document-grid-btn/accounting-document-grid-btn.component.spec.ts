import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingDocumentGridBtnComponent } from './accounting-document-grid-btn.component';

describe('BtnGridAccountingComponent', () => {
  let component: AccountingDocumentGridBtnComponent;
  let fixture: ComponentFixture<AccountingDocumentGridBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingDocumentGridBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingDocumentGridBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
