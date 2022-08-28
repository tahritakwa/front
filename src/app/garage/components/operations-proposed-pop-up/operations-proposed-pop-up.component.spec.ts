import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsProposedPopUpComponent } from './operations-proposed-pop-up.component';

describe('OperationsProposedPopUpComponent', () => {
  let component: OperationsProposedPopUpComponent;
  let fixture: ComponentFixture<OperationsProposedPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsProposedPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsProposedPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
