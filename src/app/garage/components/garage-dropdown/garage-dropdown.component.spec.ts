import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GarageDropdownComponent } from './garage-dropdown.component';

describe('GarageDropdownComponent', () => {
  let component: GarageDropdownComponent;
  let fixture: ComponentFixture<GarageDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GarageDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GarageDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
