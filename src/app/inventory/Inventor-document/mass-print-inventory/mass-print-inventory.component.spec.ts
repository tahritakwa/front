import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MassPrintInventoryComponent } from './mass-print-inventory.component';

describe('MassPrintInventoryComponent', () => {
  let component: MassPrintInventoryComponent;
  let fixture: ComponentFixture<MassPrintInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MassPrintInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassPrintInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
