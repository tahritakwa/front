import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayofweekDropdownComponent } from './dayofweek-dropdown.component';

describe('DayofweekDropdownComponent', () => {
  let component: DayofweekDropdownComponent;
  let fixture: ComponentFixture<DayofweekDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayofweekDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayofweekDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
