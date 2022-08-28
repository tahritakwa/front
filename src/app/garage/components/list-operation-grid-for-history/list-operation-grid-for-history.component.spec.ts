import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOperationGridForHistoryComponent } from './list-operation-grid-for-history.component';

describe('ListOperationGridForHistoryComponent', () => {
  let component: ListOperationGridForHistoryComponent;
  let fixture: ComponentFixture<ListOperationGridForHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOperationGridForHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOperationGridForHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
