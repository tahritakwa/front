import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTotalPurchasesDiscountComponent } from './price-total-purchases-discount.component';

describe('PriceTotalPurchasesDiscountComponent', () => {
  let component: PriceTotalPurchasesDiscountComponent;
  let fixture: ComponentFixture<PriceTotalPurchasesDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceTotalPurchasesDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceTotalPurchasesDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
