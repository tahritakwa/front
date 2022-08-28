import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalImportGridBtnComponent } from './journal-import-grid-btn.component';

describe('BtnGridAccountingComponent', () => {
  let component: JournalImportGridBtnComponent;
  let fixture: ComponentFixture<JournalImportGridBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalImportGridBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalImportGridBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
