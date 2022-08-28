import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFiltreListComponent } from './item-filtre-list.component';

describe('ItemFiltreListComponent', () => {
  let component: ItemFiltreListComponent;
  let fixture: ComponentFixture<ItemFiltreListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemFiltreListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFiltreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
