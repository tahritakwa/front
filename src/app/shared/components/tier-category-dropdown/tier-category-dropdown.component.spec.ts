import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TierCategoryDropdownComponent } from './tier-category-dropdown.component';

describe('TierCategoryDropdownComponent', () => {
  let component: TierCategoryDropdownComponent;
  let fixture: ComponentFixture<TierCategoryDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TierCategoryDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TierCategoryDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
