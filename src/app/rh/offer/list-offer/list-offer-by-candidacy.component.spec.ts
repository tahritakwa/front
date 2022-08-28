import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListOfferByCandidacyComponent} from './list-offer-by-candidacy.component';

describe('ListOfferComponent', () => {
  let component: ListOfferByCandidacyComponent;
  let fixture: ComponentFixture<ListOfferByCandidacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListOfferByCandidacyComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfferByCandidacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
