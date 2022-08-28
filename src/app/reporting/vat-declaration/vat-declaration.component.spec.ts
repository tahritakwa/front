import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VatDeclarationComponent } from './vat-declaration.component';

describe('VatDeclarationComponent', () => {
  let component: VatDeclarationComponent;
  let fixture: ComponentFixture<VatDeclarationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VatDeclarationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VatDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
