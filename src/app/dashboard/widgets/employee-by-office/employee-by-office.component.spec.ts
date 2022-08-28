import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeByOfficeComponent } from './employee-by-office.component';


describe('EmployeeByOfficeComponent', () => {
  let component: EmployeeByOfficeComponent;
  let fixture: ComponentFixture<EmployeeByOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeByOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeByOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
