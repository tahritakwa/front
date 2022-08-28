import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchItemReduicedComponent } from './search-item-reduiced.component';

describe('SearchItemReduicedComponent', () => {
  let component: SearchItemReduicedComponent;
  let fixture: ComponentFixture<SearchItemReduicedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchItemReduicedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchItemReduicedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
