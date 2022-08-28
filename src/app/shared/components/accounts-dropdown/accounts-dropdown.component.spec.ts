import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsDropdownComponentComponent } from './accounts-dropdown.component';

describe('AccountsDropdownComponentComponent', () => {
  let component: AccountsDropdownComponentComponent;
  let fixture: ComponentFixture<AccountsDropdownComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsDropdownComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsDropdownComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
