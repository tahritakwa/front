import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxeDropdownComponent } from './taxe-dropdown.component';

describe('TaxeDropdownComponent', () => {
  let component: TaxeDropdownComponent;
  let fixture: ComponentFixture<TaxeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
