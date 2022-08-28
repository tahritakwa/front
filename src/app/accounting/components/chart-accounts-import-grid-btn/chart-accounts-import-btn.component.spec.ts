import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAccountsImportBtnComponent } from './chart-accounts-import-btn.component';

describe('BtnGridAccountingComponent', () => {
  let component: ChartAccountsImportBtnComponent;
  let fixture: ComponentFixture<ChartAccountsImportBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartAccountsImportBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartAccountsImportBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
