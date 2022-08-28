import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownProductItemsComponent } from './dropdown-product-items.component';

describe('DropdownProductItemsComponent', () => {
  let component: DropdownProductItemsComponent;
  let fixture: ComponentFixture<DropdownProductItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownProductItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownProductItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
