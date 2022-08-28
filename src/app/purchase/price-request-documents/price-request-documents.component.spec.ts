import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceRequestDocumentsComponent } from './price-request-documents.component';

describe('PriceRequestDocumentsComponent', () => {
  let component: PriceRequestDocumentsComponent;
  let fixture: ComponentFixture<PriceRequestDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceRequestDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceRequestDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
