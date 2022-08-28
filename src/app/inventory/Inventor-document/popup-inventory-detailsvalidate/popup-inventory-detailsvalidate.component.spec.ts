import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupInventoryDetailsValidateComponent } from './popup-inventory-detailsvalidate.component';

describe('PopupInventoryDetailsValidateComponent', () => {
  let component: PopupInventoryDetailsValidateComponent;
  let fixture: ComponentFixture<PopupInventoryDetailsValidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupInventoryDetailsValidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupInventoryDetailsValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
