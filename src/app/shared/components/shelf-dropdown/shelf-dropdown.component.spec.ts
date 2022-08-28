import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfDropdownComponent } from './shelf-dropdown.component';

describe('ShelfDropdownComponent', () => {
  let component: ShelfDropdownComponent;
  let fixture: ComponentFixture<ShelfDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShelfDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelfDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
