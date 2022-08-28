import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryTypeDropdownComponent } from './delivery-type-dropdown.component';

describe('DeliveryTypeDropdownComponent', () => {
  let component: DeliveryTypeDropdownComponent;
  let fixture: ComponentFixture<DeliveryTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
