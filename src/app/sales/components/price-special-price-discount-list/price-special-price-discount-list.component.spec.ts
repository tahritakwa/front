import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceSpecialPriceDiscountListComponent } from './price-special-price-discount-list.component';

describe('PriceSpecialPriceDiscountListComponent', () => {
  let component: PriceSpecialPriceDiscountListComponent;
  let fixture: ComponentFixture<PriceSpecialPriceDiscountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceSpecialPriceDiscountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceSpecialPriceDiscountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
