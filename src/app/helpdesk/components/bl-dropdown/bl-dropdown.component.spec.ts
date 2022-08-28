import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BLDropdownComponent } from './bl-dropdown.component';

describe('BLDropdownComponent', () => {
  let component: BLDropdownComponent;
  let fixture: ComponentFixture<BLDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BLDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BLDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
