import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SexDropdownComponent } from './sex-dropdown.component';

describe('SexDropdownComponent', () => {
  let component: SexDropdownComponent;
  let fixture: ComponentFixture<SexDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SexDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SexDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
