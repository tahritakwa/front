import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceQuantityDiscountComponent } from './price-quantity-discount.component';

describe('PriceQuantityDiscountComponent', () => {
  let component: PriceQuantityDiscountComponent;
  let fixture: ComponentFixture<PriceQuantityDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceQuantityDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceQuantityDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
