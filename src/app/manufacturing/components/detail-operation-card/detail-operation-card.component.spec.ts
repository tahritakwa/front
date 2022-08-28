import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailOperationCardComponent } from './detail-operation-card.component';

describe('DetailOperationCardComponent', () => {
  let component: DetailOperationCardComponent;
  let fixture: ComponentFixture<DetailOperationCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailOperationCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailOperationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
