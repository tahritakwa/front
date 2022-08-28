import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LeaveInformationsComponent} from './leave-informations.component';

describe('LeaveInformationsComponent', () => {
  let component: LeaveInformationsComponent;
  let fixture: ComponentFixture<LeaveInformationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveInformationsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
