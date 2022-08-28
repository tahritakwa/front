import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTypeDropdownComponent } from './unit-type-dropdown.component';

describe('UnitTypeDropdownComponent', () => {
  let component: UnitTypeDropdownComponent;
  let fixture: ComponentFixture<UnitTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
