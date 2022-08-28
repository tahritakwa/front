import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVehicleBrandComponent } from './list-vehicle-brand.component';

describe('ListVehicleBrandComponent', () => {
  let component: ListVehicleBrandComponent;
  let fixture: ComponentFixture<ListVehicleBrandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListVehicleBrandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListVehicleBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
