import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsFamilyDropdownComponent } from './skills-family-dropdown.component';

describe('SkillsFamilyDropdownComponent', () => {
  let component: SkillsFamilyDropdownComponent;
  let fixture: ComponentFixture<SkillsFamilyDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsFamilyDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsFamilyDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
