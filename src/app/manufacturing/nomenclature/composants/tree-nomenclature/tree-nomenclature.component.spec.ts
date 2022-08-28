import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeNomenclatureComponent } from './tree-nomenclature.component';

describe('TreeNomenclatureComponent', () => {
  let component: TreeNomenclatureComponent;
  let fixture: ComponentFixture<TreeNomenclatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeNomenclatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeNomenclatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
