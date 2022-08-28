import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowChartOfAccountsComponent } from './chart-of-accounts-show.component';



describe('AddWarehouseComponent', () => {
  let component: ShowChartOfAccountsComponent;
  let fixture: ComponentFixture<ShowChartOfAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowChartOfAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowChartOfAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
