import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsLeaveExitEmployeeComponent} from './details-leave-exit-employee.component';

describe('DetailsLeaveExitEmployeeComponent', () => {
  let component: DetailsLeaveExitEmployeeComponent;
  let fixture: ComponentFixture<DetailsLeaveExitEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsLeaveExitEmployeeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsLeaveExitEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
