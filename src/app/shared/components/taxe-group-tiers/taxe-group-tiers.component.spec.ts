import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxeGroupTiersComponent } from './taxe-group-tiers.component';

describe('TaxeGroupTiersComponent', () => {
  let component: TaxeGroupTiersComponent;
  let fixture: ComponentFixture<TaxeGroupTiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxeGroupTiersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxeGroupTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
