import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StepsExitEmployeeComponent} from './steps-exit-employee.component';

describe('StepsExitEmployeeComponent', () => {
  let component: StepsExitEmployeeComponent;
  let fixture: ComponentFixture<StepsExitEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepsExitEmployeeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepsExitEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
