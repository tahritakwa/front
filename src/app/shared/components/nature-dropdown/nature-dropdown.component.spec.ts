import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureDropdownComponent } from './nature-dropdown.component';

describe('NatureDropdownComponent', () => {
  let component: NatureDropdownComponent;
  let fixture: ComponentFixture<NatureDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NatureDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NatureDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
