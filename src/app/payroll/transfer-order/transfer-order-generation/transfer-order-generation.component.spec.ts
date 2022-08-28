import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TransferOrderGenerationComponent} from './transfer-order-generation.component';

describe('TransferOrderGenerationComponent', () => {
  let component: TransferOrderGenerationComponent;
  let fixture: ComponentFixture<TransferOrderGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransferOrderGenerationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferOrderGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
