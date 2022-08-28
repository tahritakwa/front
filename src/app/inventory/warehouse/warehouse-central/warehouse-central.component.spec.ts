import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseCentralComponent } from './warehouse-central.component';

describe('WarehouseCentralComponent', () => {
  let component: WarehouseCentralComponent;
  let fixture: ComponentFixture<WarehouseCentralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseCentralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseCentralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
