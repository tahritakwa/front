import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { AddproductComponent } from "../../../shared/components/item/add-item/add-product.component";
import { Observable } from "rxjs/Observable";
import {
  greaterOrEqualThan,
  lowerOrEqualThan,
} from "../../../shared/services/validation/validation.service";
import { NumberConstant } from "../../../constant/utility/number.constant";
import { StockDocumentConstant } from "../../../constant/inventory/stock-document.constant";
import { ShelfDropdownComponent } from "../../../shared/components/shelf-dropdown/shelf-dropdown.component";
import { WarehouseConstant } from "../../../constant/inventory/warehouse.constant";
import { DepotDropdownComponent } from "../../../shared/components/depot-dropdown/depot-dropdown.component";
import { PermissionConstant } from "../../../Structure/permission-constant";
import { AuthService } from "../../../login/Authentification/services/auth.service";

@Component({
  selector: "app-gerestock",
  templateUrl: "./gerer-stock.component.html",
  styleUrls: ["./gerer-stock.component.scss"],
})
export class GerestockComponent implements AfterViewInit {
  @Input() ItemWarehouseStorage: FormGroup;
  @Output() formReady = new EventEmitter<FormGroup>();
  @Output() WarehouseSelected = new EventEmitter<boolean>();
  public selectedIdWarehouse = NumberConstant.ZERO;
  @ViewChild("shelfDropdown") private shelfDropdown: ShelfDropdownComponent;
  warehouseAssociatedToItems: number;
  @Input() isDefaultValue = true;
  @Input() index: number;
  @Input() ListLocked = [];
  @Input() disabled: boolean;
  public iswarehouseLocked: boolean;
  public isCentralWarehouseSelectedByDefault: boolean;
  @Input() isUpdateMode: FormGroup;
  @ViewChild("depoDropdown") private depoDropdown: DepotDropdownComponent;
  /**
   * permissions
   */
  public hasUpdatePermission: boolean;

  constructor(public product: AddproductComponent, private authService: AuthService) {
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ITEM_STOCK);
  }

  ngAfterViewInit() {
    this.selectedIdWarehouse = this.IdWarehouse.value;
    //this.iswarehouseLocked = this.ListLocked.includes(this.selectedIdWarehouse)
    this.addQuantitiesValidators();
    if (this.isUpdateMode && !this.hasUpdatePermission) {
      this.MinQuantity.disable();
      this.MaxQuantity.disable();
    }
    this.isCentralWarehouseSelectedByDefault = this.index == 0 ? true : false;
  }

  /**
   * updateMaxValidity
   * */
  updateMaxValidity() {
    this.MaxQuantity.updateValueAndValidity();
  }

  /**
   * updateMinValidity
   * */
  updateMinValidity() {
    this.MinQuantity.updateValueAndValidity();
  }

  updateShelfValidity() {
    this.IdStorage.updateValueAndValidity();
  }

  updateStorageValidity() {
    this.IdStorage.updateValueAndValidity();
  }

  get Warehouse(): FormGroup {
    return <FormGroup>this.ItemWarehouseStorage.get("Warehouse");
  }

  get MaxQuantity(): FormControl {
    return <FormControl>this.ItemWarehouseStorage.get("MaxQuantity");
  }

  get MinQuantity(): FormControl {
    return <FormControl>this.ItemWarehouseStorage.get("MinQuantity");
  }

  get IdStorage(): FormControl {
    return <FormControl>this.ItemWarehouseStorage.get("IdStorage");
  }

  get Shelf(): FormControl {
    return <FormControl>this.ItemWarehouseStorage.get("Shelf");
  }

  public warehouseSelected($event) {
    this.WarehouseSelected.emit($event);

    if (this.depoDropdown.isInit) {
      this.depoDropdown.isInit = false
    } else {
      this.shelfDropdown.listShelfsAndStorages = [];
      this.shelfDropdown.shelfComboBoxComponent.reset();
      this.isDefaultValue = false;
    }
    if (this.ListLocked && this.ListLocked.includes($event.newValue)) {
      $event.parent.controls[StockDocumentConstant.ID_WAREHOUSE].setValue($event.SelectedValue);
    }
    this.changeItemDropdown(
      $event.parent.value[StockDocumentConstant.ID_WAREHOUSE]
    );
    this.enableShelfDropdown($event);

  }

  private addQuantitiesValidators() {
    this.MinQuantity.setValidators([
      Validators.required,
      Validators.min(0),
      lowerOrEqualThan(new Observable((o) => o.next(this.MaxQuantity.value))),
    ]);
    this.MaxQuantity.setValidators([
      Validators.required,
      Validators.min(0),
      greaterOrEqualThan(new Observable((o) => o.next(this.MinQuantity.value))),
    ]);
  }

  /**
   *  Informe itemDropDown about warehouse changement
   */
  changeItemDropdown(idWarehouse) {
    if (idWarehouse) {
      this.warehouseAssociatedToItems = idWarehouse;
    } else {
      this.warehouseAssociatedToItems = null;
    }
  }

  get IdWarehouse(): FormControl {
    return this.ItemWarehouseStorage.get(
      WarehouseConstant.ID_WAREHOUSE
    ) as FormControl;
  }

  private enableShelfDropdown(event) {
    if (event) {
      this.selectedIdWarehouse = this.IdWarehouse.value;
    }
  }
}
