import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IntermediaryBalanceComponent } from './intermediary-balance.component';

describe('BalanceSheetComponent', () => {
  let component: IntermediaryBalanceComponent;
  let fixture: ComponentFixture<IntermediaryBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntermediaryBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntermediaryBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
