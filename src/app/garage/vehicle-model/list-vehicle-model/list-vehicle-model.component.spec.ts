import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVehicleModelComponent } from './list-vehicle-model.component';

describe('ListVehicleModelComponent', () => {
  let component: ListVehicleModelComponent;
  let fixture: ComponentFixture<ListVehicleModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListVehicleModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVehicleModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
