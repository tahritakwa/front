import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateComboboxComponent } from './candidate-combobox.component';

describe('CandidateComboboxComponent', () => {
  let component: CandidateComboboxComponent;
  let fixture: ComponentFixture<CandidateComboboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateComboboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
