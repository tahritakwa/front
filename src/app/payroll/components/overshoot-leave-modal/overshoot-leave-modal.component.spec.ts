import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OvershootLeaveModalComponent} from './overshoot-leave-modal.component';

describe('OvershootLeaveModalComponent', () => {
  let component: OvershootLeaveModalComponent;
  let fixture: ComponentFixture<OvershootLeaveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OvershootLeaveModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvershootLeaveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
