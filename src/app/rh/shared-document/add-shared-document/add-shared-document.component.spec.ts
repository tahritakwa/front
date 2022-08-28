import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddSharedDocumentComponent} from './add-shared-document.component';

describe('AddSharedDocumentComponent', () => {
  let component: AddSharedDocumentComponent;
  let fixture: ComponentFixture<AddSharedDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSharedDocumentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSharedDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
