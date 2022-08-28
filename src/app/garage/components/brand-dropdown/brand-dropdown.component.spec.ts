import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandDropdownComponent } from './brand-dropdown.component';

describe('BrandDropdownComponent', () => {
  let component: BrandDropdownComponent;
  let fixture: ComponentFixture<BrandDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
