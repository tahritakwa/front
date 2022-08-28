import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleCategoryComponent } from './rule-category.component';

describe('RuleCategoryComponent', () => {
  let component: RuleCategoryComponent;
  let fixture: ComponentFixture<RuleCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
