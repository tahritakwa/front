import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LanguageknowledgeDropdownComponent} from './language-knowledge-dropdown.component';

describe('LanguageknowledgeDropdownComponent', () => {
  let component: LanguageknowledgeDropdownComponent;
  let fixture: ComponentFixture<LanguageknowledgeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageknowledgeDropdownComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageknowledgeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
