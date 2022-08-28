import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTransferMovementComponent } from './list-transfer-movement.component';

describe('ListTransferMovementComponent', () => {
  let component: ListTransferMovementComponent;
  let fixture: ComponentFixture<ListTransferMovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTransferMovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTransferMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
