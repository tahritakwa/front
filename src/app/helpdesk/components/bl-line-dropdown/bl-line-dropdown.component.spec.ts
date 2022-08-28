import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BLLineDropdownComponent } from './bl-line-dropdown.component';

describe('BLLineDropdownComponent', () => {
  let component: BLLineDropdownComponent;
  let fixture: ComponentFixture<BLLineDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BLLineDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BLLineDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
