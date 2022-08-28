import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransferMovementComponent } from './add-transfer-movement.component';

describe('AddTransferMovementComponent', () => {
  let component: AddTransferMovementComponent;
  let fixture: ComponentFixture<AddTransferMovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTransferMovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransferMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
