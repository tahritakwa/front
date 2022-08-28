import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationForKitOperationComponent } from './operation-for-kit-operation.component';

describe('OperationForKitOperationComponent', () => {
  let component: OperationForKitOperationComponent;
  let fixture: ComponentFixture<OperationForKitOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationForKitOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationForKitOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
