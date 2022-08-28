import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MileageDropdownComponent } from './mileage-dropdown.component';

describe('MileageDropdownComponent', () => {
  let component: MileageDropdownComponent;
  let fixture: ComponentFixture<MileageDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MileageDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MileageDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
