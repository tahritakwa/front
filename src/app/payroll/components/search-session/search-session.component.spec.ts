import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchSessionComponent } from './search-session.component';


describe('SearchTiersComponent', () => {
  let component: SearchSessionComponent;
  let fixture: ComponentFixture<SearchSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
