import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOperationTypeComponent } from './add-operation-type.component';

describe('AddOperationTypeComponent', () => {
  let component: AddOperationTypeComponent;
  let fixture: ComponentFixture<AddOperationTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOperationTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOperationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
