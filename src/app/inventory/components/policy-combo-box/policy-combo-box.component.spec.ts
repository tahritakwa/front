import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyComboBoxComponent } from './policy-combo-box.component';

describe('PolicyComboBoxComponent', () => {
  let component: PolicyComboBoxComponent;
  let fixture: ComponentFixture<PolicyComboBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyComboBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
