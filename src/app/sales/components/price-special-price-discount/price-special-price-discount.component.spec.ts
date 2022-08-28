import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceSpecialPriceDiscountComponent } from './price-special-price-discount.component';

describe('PriceSpecialPriceDiscountComponent', () => {
  let component: PriceSpecialPriceDiscountComponent;
  let fixture: ComponentFixture<PriceSpecialPriceDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceSpecialPriceDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceSpecialPriceDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
