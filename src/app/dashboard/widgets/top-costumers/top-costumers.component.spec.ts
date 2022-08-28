import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCostumersComponent } from './top-costumers.component';

describe('TopCostumersComponent', () => {
  let component: TopCostumersComponent;
  let fixture: ComponentFixture<TopCostumersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopCostumersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopCostumersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
