import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterTypeDropdownComponent } from './cash-register-type-dropdown.component';

describe('CashRegisterTypeDropdownComponent', () => {
  let component: CashRegisterTypeDropdownComponent;
  let fixture: ComponentFixture<CashRegisterTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
