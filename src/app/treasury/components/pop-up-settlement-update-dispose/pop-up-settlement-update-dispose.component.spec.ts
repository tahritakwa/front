import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpSettlementUpdateDisposeComponent } from './pop-up-settlement-update-dispose.component';

describe('PopUpSettlementUpdateDisposeComponent', () => {
  let component: PopUpSettlementUpdateDisposeComponent;
  let fixture: ComponentFixture<PopUpSettlementUpdateDisposeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopUpSettlementUpdateDisposeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpSettlementUpdateDisposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
