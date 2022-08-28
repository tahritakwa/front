import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiscountGroupItemComponent } from './add-discount-group-item.component';

describe('AddDiscountGroupItemComponent', () => {
  let component: AddDiscountGroupItemComponent;
  let fixture: ComponentFixture<AddDiscountGroupItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDiscountGroupItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiscountGroupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
