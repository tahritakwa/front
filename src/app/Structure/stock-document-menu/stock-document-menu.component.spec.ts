import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDocumentMenuComponent } from './stock-document-menu.component';

describe('StockDocumentMenuComponent', () => {
  let component: StockDocumentMenuComponent;
  let fixture: ComponentFixture<StockDocumentMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockDocumentMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDocumentMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
