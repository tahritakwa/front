import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterBalanceSectionComponent } from './cash-register-balance-section.component';

describe('CashRegisterBalanceSectionComponent', () => {
  let component: CashRegisterBalanceSectionComponent;
  let fixture: ComponentFixture<CashRegisterBalanceSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterBalanceSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterBalanceSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
