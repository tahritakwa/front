import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CentralisationOfJournalsComponent } from './centralisation-of-journals.component';


describe('CentralisationOfJournalsComponent', () => {
  let component: CentralisationOfJournalsComponent;
  let fixture: ComponentFixture<CentralisationOfJournalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentralisationOfJournalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralisationOfJournalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
