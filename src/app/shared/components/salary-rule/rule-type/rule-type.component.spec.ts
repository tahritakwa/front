import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleTypeComponent } from './rule-type.component';

describe('RuleTypeComponent', () => {
  let component: RuleTypeComponent;
  let fixture: ComponentFixture<RuleTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
