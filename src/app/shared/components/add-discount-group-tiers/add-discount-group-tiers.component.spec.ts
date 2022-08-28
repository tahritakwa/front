import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiscountGroupTiersComponent } from './add-discount-group-tiers.component';

describe('AddDiscountGroupTiersComponent', () => {
  let component: AddDiscountGroupTiersComponent;
  let fixture: ComponentFixture<AddDiscountGroupTiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDiscountGroupTiersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiscountGroupTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
