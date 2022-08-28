import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FixedBonusesMultiselectComponent} from './fixed-bonuses-multiselect.component';

describe('FixedBonusesMultiselectComponent', () => {
  let component: FixedBonusesMultiselectComponent;
  let fixture: ComponentFixture<FixedBonusesMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FixedBonusesMultiselectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedBonusesMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
