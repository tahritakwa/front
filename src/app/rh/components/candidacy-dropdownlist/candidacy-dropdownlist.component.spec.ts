import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CandidacyDropdownlistComponent} from './candidacy-dropdownlist.component';

describe('CandidacyDropdownlistComponent', () => {
  let component: CandidacyDropdownlistComponent;
  let fixture: ComponentFixture<CandidacyDropdownlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CandidacyDropdownlistComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidacyDropdownlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
