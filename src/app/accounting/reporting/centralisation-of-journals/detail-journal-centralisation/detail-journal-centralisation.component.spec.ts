import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailJournalCentralisationComponent } from './detail-journal-centralisation.component';


describe('DetailJournalCentralisationComponent', () => {
  let component: DetailJournalCentralisationComponent;
  let fixture: ComponentFixture<DetailJournalCentralisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailJournalCentralisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailJournalCentralisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
