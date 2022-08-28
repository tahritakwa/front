import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingUserConfigurationComponent } from './accounting-user-configuration.component';

describe('AccountingUserConfigurationComponent', () => {
  let component: AccountingUserConfigurationComponent;
  let fixture: ComponentFixture<AccountingUserConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingUserConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingUserConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
