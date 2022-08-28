import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EmployeeDropdownComponent} from './employee-dropdown.component';

describe('EmployeeDropdownComponent', () => {
  let component: EmployeeDropdownComponent;
  let fixture: ComponentFixture<EmployeeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeDropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
