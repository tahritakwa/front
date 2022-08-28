import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TecDocSyncStepperComponent } from './tec-doc-sync-stepper.component';

describe('TecDocSyncStepperComponent', () => {
  let component: TecDocSyncStepperComponent;
  let fixture: ComponentFixture<TecDocSyncStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TecDocSyncStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TecDocSyncStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
