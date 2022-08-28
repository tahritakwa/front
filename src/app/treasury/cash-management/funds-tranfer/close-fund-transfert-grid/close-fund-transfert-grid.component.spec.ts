import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseFundTransfertGridComponent } from './close-fund-transfert-grid.component';

describe('CloseFundTransfertGridComponent', () => {
  let component: CloseFundTransfertGridComponent;
  let fixture: ComponentFixture<CloseFundTransfertGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseFundTransfertGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseFundTransfertGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
