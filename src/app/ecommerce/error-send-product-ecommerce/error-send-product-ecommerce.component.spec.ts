import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorSendProductEcommerceComponent } from './error-send-product-ecommerce.component';

describe('ErrorSendProductEcommerceComponent', () => {
  let component: ErrorSendProductEcommerceComponent;
  let fixture: ComponentFixture<ErrorSendProductEcommerceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorSendProductEcommerceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorSendProductEcommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
