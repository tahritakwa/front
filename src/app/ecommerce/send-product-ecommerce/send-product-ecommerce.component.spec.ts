import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendProductEcommerceComponent } from './send-product-ecommerce.component';

describe('SendProductEcommerceComponent', () => {
  let component: SendProductEcommerceComponent;
  let fixture: ComponentFixture<SendProductEcommerceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendProductEcommerceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendProductEcommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
