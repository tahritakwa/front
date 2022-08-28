import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountFromSettingComponent } from './bank-account-from-setting.component';

describe('BankAccountFromSettingComponent', () => {
  let component: BankAccountFromSettingComponent;
  let fixture: ComponentFixture<BankAccountFromSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAccountFromSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountFromSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
