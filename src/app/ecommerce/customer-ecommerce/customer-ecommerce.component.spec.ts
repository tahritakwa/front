import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEcommerceComponent } from './customer-ecommerce.component';

describe('CustomerEcommerceComponent', () => {
  let component: CustomerEcommerceComponent;
  let fixture: ComponentFixture<CustomerEcommerceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEcommerceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEcommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
