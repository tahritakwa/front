import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTiersComponent } from './search-tiers.component';

describe('SearchTiersComponent', () => {
  let component: SearchTiersComponent;
  let fixture: ComponentFixture<SearchTiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTiersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
