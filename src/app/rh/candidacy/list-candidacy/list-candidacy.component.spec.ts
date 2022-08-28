import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListCandidacyComponent} from './list-candidacy.component';

describe('ListCandidacyComponent', () => {
  let component: ListCandidacyComponent;
  let fixture: ComponentFixture<ListCandidacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListCandidacyComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCandidacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
