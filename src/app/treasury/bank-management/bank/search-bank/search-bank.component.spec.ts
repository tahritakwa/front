import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBankComponent } from './search-bank.component';

describe('SearchBankComponent', () => {
  let component: SearchBankComponent;
  let fixture: ComponentFixture<SearchBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
