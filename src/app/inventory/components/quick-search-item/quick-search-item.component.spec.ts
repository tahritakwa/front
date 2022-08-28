import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickSearchItemComponent } from './quick-search-item.component';

describe('QuickSearchItemComponent', () => {
  let component: QuickSearchItemComponent;
  let fixture: ComponentFixture<QuickSearchItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickSearchItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickSearchItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
