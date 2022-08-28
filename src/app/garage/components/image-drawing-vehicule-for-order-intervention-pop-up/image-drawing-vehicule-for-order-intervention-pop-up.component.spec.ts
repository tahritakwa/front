import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDrawingVehiculeForOrderInterventionPopUpComponent } from './image-drawing-vehicule-for-order-intervention-pop-up.component';

describe('ImageDrawingVehiculeForOrderInterventionPopUpComponent', () => {
  let component: ImageDrawingVehiculeForOrderInterventionPopUpComponent;
  let fixture: ComponentFixture<ImageDrawingVehiculeForOrderInterventionPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageDrawingVehiculeForOrderInterventionPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDrawingVehiculeForOrderInterventionPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
