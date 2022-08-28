import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailJournalCentralisationByMonthComponent } from './detail-journal-centralisation-by-month.component';


describe('DetailJournalCentralisationComponent', () => {
  let component: DetailJournalCentralisationByMonthComponent;
  let fixture: ComponentFixture<DetailJournalCentralisationByMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailJournalCentralisationByMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailJournalCentralisationByMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
