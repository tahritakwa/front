import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountFromTreasuryComponent } from './bank-account-from-treasury.component';

describe('BankAccountFromTreasuryComponent', () => {
  let component: BankAccountFromTreasuryComponent;
  let fixture: ComponentFixture<BankAccountFromTreasuryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAccountFromTreasuryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountFromTreasuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
