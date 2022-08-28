import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterDestinationDropdownComponent } from './cash-register-destination-dropdown.component';

describe('CashRegisterDestinationDropdownComponent', () => {
  let component: CashRegisterDestinationDropdownComponent;
  let fixture: ComponentFixture<CashRegisterDestinationDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterDestinationDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterDestinationDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
