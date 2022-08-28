import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingTemplateImportGridBtn } from './accounting-template-import-grid-btn.component';

describe('BtnGridAccountingComponent', () => {
  let component: AccountingTemplateImportGridBtn;
  let fixture: ComponentFixture<AccountingTemplateImportGridBtn>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingTemplateImportGridBtn ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingTemplateImportGridBtn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
