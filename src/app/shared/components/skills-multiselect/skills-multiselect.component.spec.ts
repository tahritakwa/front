import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsMultiselectComponent } from './skills-multiselect.component';

describe('SkillsMultiselectComponent', () => {
  let component: SkillsMultiselectComponent;
  let fixture: ComponentFixture<SkillsMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsMultiselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
