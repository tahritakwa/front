import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderShortcutComponent } from './header-shortcut.component';

describe('HeaderShortcutComponent', () => {
  let component: HeaderShortcutComponent;
  let fixture: ComponentFixture<HeaderShortcutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderShortcutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderShortcutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
