import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFicheComponent } from './item-fiche.component';

describe('ItemFicheComponent', () => {
  let component: ItemFicheComponent;
  let fixture: ComponentFixture<ItemFicheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemFicheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
