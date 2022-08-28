import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SesssionStepperComponent} from './sesssion-stepper.component';

describe('SesssionStepperComponent', () => {
  let component: SesssionStepperComponent;
  let fixture: ComponentFixture<SesssionStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SesssionStepperComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SesssionStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
