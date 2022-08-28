import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationKitSelectedComponent } from './operation-kit-selected.component';

describe('OperationKitSelectedComponent', () => {
  let component: OperationKitSelectedComponent;
  let fixture: ComponentFixture<OperationKitSelectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationKitSelectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationKitSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
