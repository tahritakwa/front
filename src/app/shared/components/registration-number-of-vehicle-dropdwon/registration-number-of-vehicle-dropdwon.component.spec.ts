import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationNumberOfVehicleDropdwonComponent } from './registration-number-of-vehicle-dropdwon.component';

describe('RegistrationNumberOfVehicleDropdwonComponent', () => {
  let component: RegistrationNumberOfVehicleDropdwonComponent;
  let fixture: ComponentFixture<RegistrationNumberOfVehicleDropdwonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationNumberOfVehicleDropdwonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationNumberOfVehicleDropdwonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
