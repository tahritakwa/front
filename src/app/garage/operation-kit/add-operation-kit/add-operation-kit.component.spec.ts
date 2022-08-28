import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOperationKitComponent } from './add-operation-kit.component';

describe('AddOperationKitComponent', () => {
  let component: AddOperationKitComponent;
  let fixture: ComponentFixture<AddOperationKitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOperationKitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOperationKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
