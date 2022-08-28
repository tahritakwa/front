import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNomenclatureComponent } from './list-nomenclature.component';

describe('ListNomenclatureComponent', () => {
  let component: ListNomenclatureComponent;
  let fixture: ComponentFixture<ListNomenclatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListNomenclatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNomenclatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
