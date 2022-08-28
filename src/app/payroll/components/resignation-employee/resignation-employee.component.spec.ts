import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ResignationEmployeeComponent} from './resignation-employee.component';

describe('ResignationEmployeeComponent', () => {
  let component: ResignationEmployeeComponent;
  let fixture: ComponentFixture<ResignationEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResignationEmployeeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResignationEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
