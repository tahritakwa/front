import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EmployeeMultiselectComponent} from './employee-multiselect.component';

describe('EmployeeMultiselectComponent', () => {
  let component: EmployeeMultiselectComponent;
  let fixture: ComponentFixture<EmployeeMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeMultiselectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
