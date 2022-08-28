import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricDetailsDocumentAccountComponent } from './historic-details-document-account.component';

describe('HistoricDetailsDocumentAccountComponent', () => {
  let component: HistoricDetailsDocumentAccountComponent;
  let fixture: ComponentFixture<HistoricDetailsDocumentAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricDetailsDocumentAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricDetailsDocumentAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
