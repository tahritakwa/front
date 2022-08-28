import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountImportGridBtnComponent } from './account-import-grid-btn.component';

describe('BtnGridAccountingComponent', () => {
  let component: AccountImportGridBtnComponent;
  let fixture: ComponentFixture<AccountImportGridBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountImportGridBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountImportGridBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
