import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AttendanceInformationsComponent} from './attendance-informations.component';

describe('AttendanceInformationsComponent', () => {
  let component: AttendanceInformationsComponent;
  let fixture: ComponentFixture<AttendanceInformationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttendanceInformationsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
