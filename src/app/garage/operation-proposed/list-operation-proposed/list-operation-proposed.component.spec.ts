import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOperationProposedComponent } from './list-operation-proposed.component';

describe('ListOperationProposedComponent', () => {
  let component: ListOperationProposedComponent;
  let fixture: ComponentFixture<ListOperationProposedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOperationProposedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOperationProposedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
