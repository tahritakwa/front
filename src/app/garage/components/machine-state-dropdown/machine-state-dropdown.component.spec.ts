import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineStateDropdownComponent } from './machine-state-dropdown.component';

describe('MachineStateDropdownComponent', () => {
  let component: MachineStateDropdownComponent;
  let fixture: ComponentFixture<MachineStateDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineStateDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineStateDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
