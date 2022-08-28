import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceQuantityDiscountListComponent } from './price-quantity-discount-list.component';

describe('PriceQuantityDiscountListComponent', () => {
  let component: PriceQuantityDiscountListComponent;
  let fixture: ComponentFixture<PriceQuantityDiscountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceQuantityDiscountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceQuantityDiscountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
