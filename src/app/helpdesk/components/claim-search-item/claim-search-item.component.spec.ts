import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClaimSearchItemComponent } from './claim-search-item.component';

describe('ClaimSearchItemComponent', () => {
  let component: ClaimSearchItemComponent;
  let fixture: ComponentFixture<ClaimSearchItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimSearchItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSearchItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
