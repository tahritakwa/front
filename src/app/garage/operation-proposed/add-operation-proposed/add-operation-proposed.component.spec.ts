import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOperationProposedComponent } from './add-operation-proposed.component';

describe('AddOperationProposedComponent', () => {
  let component: AddOperationProposedComponent;
  let fixture: ComponentFixture<AddOperationProposedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOperationProposedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOperationProposedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
