import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingCategoryAndDropdownsComponent } from './setting-category-and-dropdowns.component';

describe('SettingCategoryAndDropdownsComponent', () => {
  let component: SettingCategoryAndDropdownsComponent;
  let fixture: ComponentFixture<SettingCategoryAndDropdownsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingCategoryAndDropdownsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingCategoryAndDropdownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
