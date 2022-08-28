import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsFamilyMultiselectComponent } from './skills-family-multiselect.component';

describe('SkillsFamilyMultiselectComponent', () => {
  let component: SkillsFamilyMultiselectComponent;
  let fixture: ComponentFixture<SkillsFamilyMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsFamilyMultiselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsFamilyMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
