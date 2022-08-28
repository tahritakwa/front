import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEcommerceComponent } from './product-ecommerce.component';

describe('ProductEcommerceComponent', () => {
  let component: ProductEcommerceComponent;
  let fixture: ComponentFixture<ProductEcommerceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductEcommerceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEcommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
