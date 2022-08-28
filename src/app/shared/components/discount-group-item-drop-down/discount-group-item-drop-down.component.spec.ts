import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountGroupItemDropDownComponent } from './discount-group-item-drop-down.component';

describe('DiscountGroupItemDropDownComponent', () => {
  let component: DiscountGroupItemDropDownComponent;
  let fixture: ComponentFixture<DiscountGroupItemDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountGroupItemDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountGroupItemDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
