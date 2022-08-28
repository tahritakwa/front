import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BaseSalaryValidityComponent} from './base-salary-validity.component';

describe('BaseSalaryValidityComponent', () => {
  let component: BaseSalaryValidityComponent;
  let fixture: ComponentFixture<BaseSalaryValidityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseSalaryValidityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseSalaryValidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
