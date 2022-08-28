import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LeaveTypeDropdownComponent} from './leave-type-dropdown.component';

describe('LeaveTypeDropdownComponent', () => {
  let component: LeaveTypeDropdownComponent;
  let fixture: ComponentFixture<LeaveTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveTypeDropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

