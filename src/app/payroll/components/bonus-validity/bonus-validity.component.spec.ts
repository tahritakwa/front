import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BonusValidityComponent} from './bonus-validity.component';

describe('BonusValidityComponent', () => {
  let component: BonusValidityComponent;
  let fixture: ComponentFixture<BonusValidityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BonusValidityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusValidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
