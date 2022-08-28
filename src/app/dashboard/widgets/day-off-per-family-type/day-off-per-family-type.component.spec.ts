import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOffPerFamilyTypeComponent } from './day-off-per-family-type.component';

describe('DayOffPerFamilyTypeComponent', () => {
  let component: DayOffPerFamilyTypeComponent;
  let fixture: ComponentFixture<DayOffPerFamilyTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayOffPerFamilyTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayOffPerFamilyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
