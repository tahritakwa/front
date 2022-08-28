import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDropdownComponent } from './product-dropdown.component';

describe('ProductDropdownComponent', () => {
  let component: ProductDropdownComponent;
  let fixture: ComponentFixture<ProductDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
