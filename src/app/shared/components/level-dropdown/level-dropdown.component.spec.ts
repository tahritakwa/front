import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelDropdownComponent } from './level-dropdown.component';

describe('LevelDropdownComponent', () => {
  let component: LevelDropdownComponent;
  let fixture: ComponentFixture<LevelDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
