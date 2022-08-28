import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExitEmployeeDesactivateComponent} from './exit-employee-desactivate.component';

describe('ExitEmployeeDesactivateComponent', () => {
  let component: ExitEmployeeDesactivateComponent;
  let fixture: ComponentFixture<ExitEmployeeDesactivateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExitEmployeeDesactivateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitEmployeeDesactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
