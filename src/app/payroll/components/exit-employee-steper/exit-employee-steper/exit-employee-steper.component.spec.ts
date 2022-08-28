import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExitEmployeeSteperComponent} from './exit-employee-steper.component';

describe('ExitEmployeeSteperComponent', () => {
  let component: ExitEmployeeSteperComponent;
  let fixture: ComponentFixture<ExitEmployeeSteperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExitEmployeeSteperComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitEmployeeSteperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
