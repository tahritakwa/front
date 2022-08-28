import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyDropdownComponent } from './energy-dropdown.component';

describe('EnergyDropdownComponent', () => {
  let component: EnergyDropdownComponent;
  let fixture: ComponentFixture<EnergyDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
