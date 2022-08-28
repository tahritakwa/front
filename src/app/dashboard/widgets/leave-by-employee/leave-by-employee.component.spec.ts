import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveByEmployeeComponent } from './leave-by-employee.component';


describe('LeaveByEmployeeComponent', () => {
  let component: LeaveByEmployeeComponent;
  let fixture: ComponentFixture<LeaveByEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveByEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveByEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
