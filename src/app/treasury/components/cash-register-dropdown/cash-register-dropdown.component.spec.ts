import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterDropdownComponent } from './cash-register-dropdown.component';

describe('CashRegisterDropdownComponent', () => {
  let component: CashRegisterDropdownComponent;
  let fixture: ComponentFixture<CashRegisterDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
