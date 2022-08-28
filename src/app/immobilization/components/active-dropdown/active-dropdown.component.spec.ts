import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveDropdownComponent } from './active-dropdown.component';

describe('ActiveDropdownComponent', () => {
  let component: ActiveDropdownComponent;
  let fixture: ComponentFixture<ActiveDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
