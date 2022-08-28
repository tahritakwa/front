import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AddRecruitmentRequestOfferComponent} from './add-recruitment-request-offer.component';

describe('AddRecruitmentRequestOfferComponent', () => {
  let component: AddRecruitmentRequestOfferComponent;
  let fixture: ComponentFixture<AddRecruitmentRequestOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddRecruitmentRequestOfferComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecruitmentRequestOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
