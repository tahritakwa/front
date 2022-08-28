import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VariableBonusesSectionComponent} from './variable-bonuses-section.component';

describe('VariableBonusesSectionComponent', () => {
  let component: VariableBonusesSectionComponent;
  let fixture: ComponentFixture<VariableBonusesSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VariableBonusesSectionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableBonusesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
