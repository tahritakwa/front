import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffTurnoverComponent } from './staff-turnover.component';

describe('StaffTurnoverComponent', () => {
  let component: StaffTurnoverComponent;
  let fixture: ComponentFixture<StaffTurnoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffTurnoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffTurnoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
