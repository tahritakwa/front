import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTotalPurchasesDiscountListComponent } from './price-total-purchases-discount-list.component';

describe('PriceTotalPurchasesDiscountListComponent', () => {
  let component: PriceTotalPurchasesDiscountListComponent;
  let fixture: ComponentFixture<PriceTotalPurchasesDiscountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceTotalPurchasesDiscountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceTotalPurchasesDiscountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
