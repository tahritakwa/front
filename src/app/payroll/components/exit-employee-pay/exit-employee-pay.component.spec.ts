import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExitEmployeePayComponent} from './exit-employee-pay.component';

describe('ExitEmployeePayComponent', () => {
  let component: ExitEmployeePayComponent;
  let fixture: ComponentFixture<ExitEmployeePayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExitEmployeePayComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitEmployeePayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
