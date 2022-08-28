import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterSourceDropdownComponent } from './cash-register-source-dropdown.component';

describe('CashRegisterSourceDropdownComponent', () => {
  let component: CashRegisterSourceDropdownComponent;
  let fixture: ComponentFixture<CashRegisterSourceDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterSourceDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterSourceDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
