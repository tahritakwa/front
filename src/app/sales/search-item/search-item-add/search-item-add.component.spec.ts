import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchItemAddComponent } from './search-item-add.component';

describe('SearchItemAddComponent', () => {
  let component: SearchItemAddComponent;
  let fixture: ComponentFixture<SearchItemAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchItemAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchItemAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
