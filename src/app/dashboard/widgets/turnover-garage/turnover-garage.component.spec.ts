import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoverGarageComponent } from './turnover-garage.component';

describe('TurnoverGarageComponent', () => {
  let component: TurnoverGarageComponent;
  let fixture: ComponentFixture<TurnoverGarageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnoverGarageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoverGarageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
