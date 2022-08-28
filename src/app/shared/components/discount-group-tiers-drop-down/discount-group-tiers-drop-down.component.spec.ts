import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountGroupTiersDropDownComponent } from './discount-group-tiers-drop-down.component';

describe('DiscountGroupTiersDropDownComponent', () => {
  let component: DiscountGroupTiersDropDownComponent;
  let fixture: ComponentFixture<DiscountGroupTiersDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountGroupTiersDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountGroupTiersDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
