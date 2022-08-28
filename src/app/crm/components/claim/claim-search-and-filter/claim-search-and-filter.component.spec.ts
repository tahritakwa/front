import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimSearchAndFilterComponent } from './claim-search-and-filter.component';

describe('ClaimSearchAndFilterComponent', () => {
  let component: ClaimSearchAndFilterComponent;
  let fixture: ComponentFixture<ClaimSearchAndFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimSearchAndFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSearchAndFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
