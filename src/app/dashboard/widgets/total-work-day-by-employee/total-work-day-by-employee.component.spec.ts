import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TotalWorkDayByEmployeeComponent } from './total-work-day-by-employee.component';


describe('GendreByMonthComponent', () => {
  let component: TotalWorkDayByEmployeeComponent;
  let fixture: ComponentFixture<TotalWorkDayByEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalWorkDayByEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalWorkDayByEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
