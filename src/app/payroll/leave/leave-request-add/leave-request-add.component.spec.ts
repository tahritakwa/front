import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LeaveRequestAddComponent} from './leave-request-add.component';


describe('LeaveRequestAddComponent', () => {
  let component: LeaveRequestAddComponent;
  let fixture: ComponentFixture<LeaveRequestAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveRequestAddComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveRequestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
