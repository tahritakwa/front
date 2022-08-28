import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationKitOperationPopUpComponent } from './operation-kit-operation-pop-up.component';

describe('OperationKitOperationPopUpComponent', () => {
  let component: OperationKitOperationPopUpComponent;
  let fixture: ComponentFixture<OperationKitOperationPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationKitOperationPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationKitOperationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
