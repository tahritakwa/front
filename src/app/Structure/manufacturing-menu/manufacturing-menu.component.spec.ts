import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingMenuComponent } from './manufacturing-menu.component';

describe('ManufacturingMenuComponent', () => {
  let component: ManufacturingMenuComponent;
  let fixture: ComponentFixture<ManufacturingMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturingMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
