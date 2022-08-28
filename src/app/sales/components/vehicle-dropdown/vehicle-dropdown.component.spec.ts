import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDropdownComponent } from './vehicle-dropdown.component';

describe('VehicleDropdownComponent', () => {
  let component: VehicleDropdownComponent;
  let fixture: ComponentFixture<VehicleDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
