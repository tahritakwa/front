import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsFamilyComponent } from './skills-family.component';

describe('SkillsFamilyComponent', () => {
  let component: SkillsFamilyComponent;
  let fixture: ComponentFixture<SkillsFamilyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsFamilyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
