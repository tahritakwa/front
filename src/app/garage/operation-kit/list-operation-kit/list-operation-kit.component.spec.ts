import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOperationKitComponent } from './list-operation-kit.component';

describe('ListOperationKitComponent', () => {
  let component: ListOperationKitComponent;
  let fixture: ComponentFixture<ListOperationKitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOperationKitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOperationKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
