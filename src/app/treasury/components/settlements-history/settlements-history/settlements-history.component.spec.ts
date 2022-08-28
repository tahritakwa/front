import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementsHistoryComponent } from './settlements-history.component';

describe('SettlementsHistoryComponent', () => {
  let component: SettlementsHistoryComponent;
  let fixture: ComponentFixture<SettlementsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
