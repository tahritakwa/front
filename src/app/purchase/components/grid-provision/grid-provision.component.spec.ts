import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridProvisionComponent } from './grid-provision.component';

describe('GridProvisionComponent', () => {
  let component: GridProvisionComponent;
  let fixture: ComponentFixture<GridProvisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridProvisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridProvisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
