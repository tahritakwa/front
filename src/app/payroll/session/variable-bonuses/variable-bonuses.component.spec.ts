import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VariableBonusesComponent} from './variable-bonuses.component';

describe('VariableBonusesComponent', () => {
  let component: VariableBonusesComponent;
  let fixture: ComponentFixture<VariableBonusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VariableBonusesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableBonusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
