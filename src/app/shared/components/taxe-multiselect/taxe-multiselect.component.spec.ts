import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxeMultiselectComponent } from './taxe-multiselect.component';

describe('TaxeMultiselectComponent', () => {
  let component: TaxeMultiselectComponent;
  let fixture: ComponentFixture<TaxeMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxeMultiselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxeMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
