import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleInterventionListComponent } from './vehicle-intervention-list.component';

describe('VehicleInterventionListComponent', () => {
  let component: VehicleInterventionListComponent;
  let fixture: ComponentFixture<VehicleInterventionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleInterventionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleInterventionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
