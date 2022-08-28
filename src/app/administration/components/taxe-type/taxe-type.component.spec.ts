import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxeTypeComponent } from './taxe-type.component';

describe('TaxeTypeComponent', () => {
  let component: TaxeTypeComponent;
  let fixture: ComponentFixture<TaxeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
