import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleModelDropdownComponent } from './vehicle-model-dropdown.component';

describe('VehicleModelDropdownComponent', () => {
  let component: VehicleModelDropdownComponent;
  let fixture: ComponentFixture<VehicleModelDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleModelDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleModelDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
