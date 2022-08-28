import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppointmentPopUpComponent } from './add-appointment-pop-up.component';

describe('AddAppointmentPopUpComponent', () => {
  let component: AddAppointmentPopUpComponent;
  let fixture: ComponentFixture<AddAppointmentPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAppointmentPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAppointmentPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
