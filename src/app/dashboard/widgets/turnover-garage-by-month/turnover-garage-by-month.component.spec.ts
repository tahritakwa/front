import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoverGarageByMonthComponent } from './turnover-garage-by-month.component';

describe('TurnoverGarageByMonthComponent', () => {
  let component: TurnoverGarageByMonthComponent;
  let fixture: ComponentFixture<TurnoverGarageByMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnoverGarageByMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoverGarageByMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
