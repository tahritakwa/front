import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GendreByMonthComponent } from './gendre-by-month.component';


describe('GendreByMonthComponent', () => {
  let component: GendreByMonthComponent;
  let fixture: ComponentFixture<GendreByMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GendreByMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GendreByMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
