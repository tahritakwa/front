import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPeriodeComponent } from './search-periode.component';

describe('SearchPeriodeComponent', () => {
  let component: SearchPeriodeComponent;
  let fixture: ComponentFixture<SearchPeriodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPeriodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPeriodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
