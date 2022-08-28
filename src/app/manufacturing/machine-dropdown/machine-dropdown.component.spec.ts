import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineDropdownComponent } from './machine-dropdown.component';

describe('MachineDropdownComponent', () => {
  let component: MachineDropdownComponent;
  let fixture: ComponentFixture<MachineDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
