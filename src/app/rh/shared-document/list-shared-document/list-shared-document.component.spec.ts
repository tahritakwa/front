import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListSharedDocumentComponent} from './list-shared-document.component';

describe('ListSharedDocumentComponent', () => {
  let component: ListSharedDocumentComponent;
  let fixture: ComponentFixture<ListSharedDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListSharedDocumentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSharedDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
