import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxiliaryJournalDetailsComponent } from './auxiliary-journal-details.component';

describe('AuxiliaryJournalDetailsComponent', () => {
  let component: AuxiliaryJournalDetailsComponent;
  let fixture: ComponentFixture<AuxiliaryJournalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuxiliaryJournalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuxiliaryJournalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
