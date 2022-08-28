import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryEcommerceComponent } from './delivery-ecommerce.component';

describe('DeliveryEcommerceComponent', () => {
  let component: DeliveryEcommerceComponent;
  let fixture: ComponentFixture<DeliveryEcommerceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryEcommerceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryEcommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
