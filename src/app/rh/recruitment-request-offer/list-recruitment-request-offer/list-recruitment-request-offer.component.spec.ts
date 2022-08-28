import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ListRecruitmentRequestOfferComponent} from './list-recruitment-request-offer.component';

describe('ListRecruitmentRequestOfferComponent', () => {
  let component: ListRecruitmentRequestOfferComponent;
  let fixture: ComponentFixture<ListRecruitmentRequestOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListRecruitmentRequestOfferComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRecruitmentRequestOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
