import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild} from '@angular/core';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {WarehouseService} from '../../../inventory/services/warehouse/warehouse.service';
import {WarehouseConstant} from '../../../constant/inventory/warehouse.constant';
import {FormControl, FormGroup} from '@angular/forms';
import {Shelf} from '../../../models/inventory/shelf.model';
import {Storage} from '../../../models/inventory/storage.model';
import {ShelfService} from '../../../inventory/services/shelf/shelf.service';
import {Subscription} from 'rxjs/Subscription';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-shelf-dropdown',
  templateUrl: './shelf-dropdown.component.html',
  styleUrls: ['./shelf-dropdown.component.scss']
})
export class ShelfDropdownComponent implements OnChanges, OnDestroy {
  private subscription: Subscription;
  @Input() parent: FormGroup;
  @Input() idWarehouse = NumberConstant.ZERO;
  @Input() shelfName = WarehouseConstant.ID_SHELF;
  @Input() disabled = false;
  @Output() Selected = new EventEmitter<number>();
  @ViewChild(ComboBoxComponent) shelfComboBoxComponent: ComboBoxComponent;
  public listShelfsAndStorages = [];
  public listShelfsAndStoragesFiltred = [];
  @Input() isDefaultValue;
  public defaultValueStorage;
  public selectedIdStorage;


  /**
   *
   * @param warehouseService
   * @param shelfService
   */
  constructor(private warehouseService: WarehouseService, private shelfService: ShelfService) {
    this.getSelectedWarehouseFromAdavancedSearch();
  }

  /**
   *
   * @private
   */
  public getSelectedWarehouseFromAdavancedSearch() {
    this.subscription = this.shelfService.idWarehouseChange.subscribe(data => {
      this.resetShelfDropdownValues();
      if (data) {
        this.idWarehouse = data;
        this.initShelfAndStorageDropdown();
      }
    });
  }

  private resetShelfDropdownValues() {
    this.listShelfsAndStorages = [];
    this.listShelfsAndStoragesFiltred = [];
    this.shelfComboBoxComponent.reset();
  }

  /**
   *
   * @param storageId
   */
  handleValueChange(storageId) {
    this.selectedIdStorage = storageId;
    this.Selected.emit(storageId);
  }

  /**
   * @param shelfLabel
   */
  handleFiltreChange(shelfLabel) {
    this.listShelfsAndStorages = this.listShelfsAndStoragesFiltred
      .filter(shelf => shelf.Label.toLowerCase().includes(shelfLabel.toLowerCase()));
  }

  public async initShelfAndStorageDropdown() {
    this.listShelfsAndStorages = [];
    this.listShelfsAndStoragesFiltred = [];
    const shelfs = await this.warehouseService.getShelfByWarehouse(this.idWarehouse).toPromise();
    shelfs.forEach((shelf: Shelf) => {
      if (shelf.Storage) {
        this.loadListShelfAndStorage(shelf);
      }
    });
  }

  private loadListShelfAndStorage(shelf: Shelf) {
    shelf.Storage.forEach((storage: Storage) => {
      const shelfAndStorage = {[WarehouseConstant.ID_STORAGE]: storage.Id, [WarehouseConstant.LABEL]: `${shelf.Label}${storage.Label}`};
      this.listShelfsAndStorages.push(shelfAndStorage);
      this.listShelfsAndStoragesFiltred.push(shelfAndStorage);
      this.setDefaultValueShelfAndStorage();
    });
  }

  setDefaultValueShelfAndStorage() {
    if (this.isDefaultValue && this.listShelfsAndStorages) {
      this.defaultValueStorage = this.listShelfsAndStorages.filter(selectedItem => selectedItem.IdStorage === this.IdStorage.value)[NumberConstant.ZERO];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idWarehouse && changes.idWarehouse.currentValue > 0) {
      this.initShelfAndStorageDropdown();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get IdStorage(): FormControl {
    return this.parent.get(WarehouseConstant.ID_STORAGE) as FormControl;
  }
}
