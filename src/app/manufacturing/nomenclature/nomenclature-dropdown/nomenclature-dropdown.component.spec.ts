import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NomenclatureDropdownComponent } from './nomenclature-dropdown.component';

describe('NomenclatureDropdownComponent', () => {
  let component: NomenclatureDropdownComponent;
  let fixture: ComponentFixture<NomenclatureDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NomenclatureDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NomenclatureDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
