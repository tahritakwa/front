import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierOutstandingComponent } from './supplier-outstanding.component';

describe('SupplierOutstandingComponent', () => {
  let component: SupplierOutstandingComponent;
  let fixture: ComponentFixture<SupplierOutstandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierOutstandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierOutstandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
