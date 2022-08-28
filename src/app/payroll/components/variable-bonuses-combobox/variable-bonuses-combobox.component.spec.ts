import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VariableBonusesComboboxComponent} from './variable-bonuses-combobox.component';

describe('VariableBonusesComboboxComponent', () => {
  let component: VariableBonusesComboboxComponent;
  let fixture: ComponentFixture<VariableBonusesComboboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VariableBonusesComboboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableBonusesComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
