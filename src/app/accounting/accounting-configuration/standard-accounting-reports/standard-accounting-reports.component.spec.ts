import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardAccountingReportsComponent } from './standard-accounting-reports.component';

describe('StandardAccountingReportsComponent', () => {
  let component: StandardAccountingReportsComponent;
  let fixture: ComponentFixture<StandardAccountingReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardAccountingReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardAccountingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
