import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddLeaveTypeComponent} from './add-leave-type.component';

describe('AddLeaveTypeComponent', () => {
  let component: AddLeaveTypeComponent;
  let fixture: ComponentFixture<AddLeaveTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddLeaveTypeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLeaveTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
