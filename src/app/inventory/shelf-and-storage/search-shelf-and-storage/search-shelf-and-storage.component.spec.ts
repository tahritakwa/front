import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchShelfAndStorageComponent } from './search-shelf-and-storage.component';

describe('SearchShelfAndStorageComponent', () => {
  let component: SearchShelfAndStorageComponent;
  let fixture: ComponentFixture<SearchShelfAndStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchShelfAndStorageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchShelfAndStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
