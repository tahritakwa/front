import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadLineDocumentComponent } from './dead-line-document.component';

describe('DeadLineDocumentComponent', () => {
  let component: DeadLineDocumentComponent;
  let fixture: ComponentFixture<DeadLineDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeadLineDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadLineDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
