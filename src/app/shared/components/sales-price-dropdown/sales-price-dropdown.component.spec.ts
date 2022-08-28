import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPriceDropdownComponent } from './sales-price-dropdown.component';

describe('SalesPriceDropdownComponent', () => {
  let component: SalesPriceDropdownComponent;
  let fixture: ComponentFixture<SalesPriceDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPriceDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPriceDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
