import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletGridComponent } from './wallet-grid.component';

describe('WalletGridComponent', () => {
  let component: WalletGridComponent;
  let fixture: ComponentFixture<WalletGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
