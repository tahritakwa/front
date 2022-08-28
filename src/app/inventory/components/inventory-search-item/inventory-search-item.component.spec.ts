import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InventorySearchItemComponent } from './inventory-search-item.component';

describe('InventorySearchItemComponent', () => {
  let component: InventorySearchItemComponent;
  let fixture: ComponentFixture<InventorySearchItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorySearchItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorySearchItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
