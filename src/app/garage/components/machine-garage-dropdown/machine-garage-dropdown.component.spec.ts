import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineGarageDropdownComponent } from './machine-garage-dropdown.component';

describe('MachineGarageDropdownComponent', () => {
  let component: MachineGarageDropdownComponent;
  let fixture: ComponentFixture<MachineGarageDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineGarageDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineGarageDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
