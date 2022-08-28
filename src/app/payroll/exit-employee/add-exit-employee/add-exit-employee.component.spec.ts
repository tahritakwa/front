import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddExitEmployeeComponent} from './add-exit-employee.component';

describe('AddLeaveEmployeeComponent', () => {
  let component: AddExitEmployeeComponent;
  let fixture: ComponentFixture<AddExitEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddExitEmployeeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExitEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
