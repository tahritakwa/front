import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquisationDateDatepickerComponent } from './acquisation-date-datepicker.component';

describe('AcquisationDateDatepickerComponent', () => {
  let component: AcquisationDateDatepickerComponent;
  let fixture: ComponentFixture<AcquisationDateDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcquisationDateDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquisationDateDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
