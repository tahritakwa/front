import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BonusDropdownComponent} from './bonus-dropdown.component';

describe('BonusDropdownComponent', () => {
  let component: BonusDropdownComponent;
  let fixture: ComponentFixture<BonusDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BonusDropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
