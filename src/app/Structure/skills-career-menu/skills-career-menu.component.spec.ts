import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsCareerMenuComponent } from './skills-career-menu.component';

describe('SkillsCareerMenuComponent', () => {
  let component: SkillsCareerMenuComponent;
  let fixture: ComponentFixture<SkillsCareerMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsCareerMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsCareerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
