import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseOrgComponent } from './warehouse-org.component';

describe('WarehouseOrgComponent', () => {
  let component: WarehouseOrgComponent;
  let fixture: ComponentFixture<WarehouseOrgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarehouseOrgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
