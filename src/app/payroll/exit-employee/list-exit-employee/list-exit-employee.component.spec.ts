import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListExitEmployeeComponent} from './list-exit-employee.component';

describe('ListExitEmployeeComponent', () => {
  let component: ListExitEmployeeComponent;
  let fixture: ComponentFixture<ListExitEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListExitEmployeeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExitEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
