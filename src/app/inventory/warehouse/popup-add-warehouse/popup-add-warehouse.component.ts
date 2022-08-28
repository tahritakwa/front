import {Component, ComponentRef, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {Warehouse} from '../../../models/inventory/warehouse.model';
import {shelfAndStoragePattern, unique, ValidationService} from '../../../shared/services/validation/validation.service';
import {WarehouseService} from '../../services/warehouse/warehouse.service';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {WarehouseConstant} from '../../../constant/inventory/warehouse.constant';
import {TranslateService} from '@ngx-translate/core';
import {Shelf} from '../../../models/inventory/shelf.model';
import {ShelfService} from '../../services/shelf/shelf.service';
import {Storage} from '../../../models/inventory/storage.model';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { Router } from '@angular/router';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-popup-add-warehouse',
  templateUrl: './popup-add-warehouse.component.html',
  styleUrls: ['./popup-add-warehouse.component.scss']
})
export class PopupAddWarehouseComponent implements OnInit, IModalDialog {
  /*
 * Form Group
 */
  warehouseFormGroup: FormGroup;
  shelfAndStorageFormGroup: FormGroup;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public disabledWarehouseParent: boolean;
  public isCentralValue: boolean;
  public ecommerceWarehouse: Warehouse;
  public isShelfAndStorage = false;
  public isWarehouseDropdownTypeDepotAndCentral = false;
  public isWarehouseDropdownTypeZoneAndCentral = false;
  public warehouseLabel: string;
  public showAddButton = true;
  public shelfAndStorageLabelPlaceHolder = WarehouseConstant.SHELF_AND_STORAGE_LABEL_PLACEHOLDER;
  private id: 0;
  public nameAlreadyExists = false;
  /**
   * permissions
   */
   public hasUpdatePermission: boolean;
   public hasAddPermission: boolean;
   public hasUpdateShelfStoragePermission: boolean;
   public hasAddShelfStoragePermission: boolean;
   public hasUpdateZonePermission: boolean;
   public hasAddZonePermission : boolean ;
   public updatePermission : boolean ;
   public addPermission : boolean;
  /**
   *
   * @param formBuilder
   * @param validationService
   * @param translate
   * @param warehouseService
   * @param shelfService
   * @param modalService
   */
  constructor(private formBuilder: FormBuilder, private validationService: ValidationService, public translate: TranslateService,
              public warehouseService: WarehouseService, private shelfService: ShelfService, private modalService: ModalDialogInstanceService,private router: Router,
              private authService: AuthService) {
    this.showAddButton = true;
    this.ecommerceWarehouse = new Warehouse();
  }


  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
  }

  /**
   * save warehouse object
   */
  saveWarehouse() {
    if(this.isCentralValue){
      this.IdWarehouseParent.setValidators([]);
    }
    if (this.warehouseFormGroup.valid  && !this.nameAlreadyExists) {
      // Temporary code
      const valueToSend = this.warehouseFormGroup.value as Warehouse;
      valueToSend.IdUserResponsable = this.warehouseFormGroup.value['IdUser'];
      // Set value ecommerce
      valueToSend.IsEcommerce = this.ecommerceWarehouse.IsEcommerce;
      valueToSend.ForEcommerceModule = this.ecommerceWarehouse.ForEcommerceModule;
      valueToSend.WarehouseName = valueToSend.WarehouseName.trim();
      this.warehouseService.save(valueToSend, !this.isUpdateMode).subscribe(() => {
          this.optionDialog.onClose();
          this.modalService.closeAnyExistingModalDialog();
          this.warehouseService.warehouseSaveOperationChange.next(true);
        }
      );
    } else {
      this.validationService.validateAllFormFields(this.warehouseFormGroup);
    }
  }

  /**
   * save shelfAndStorage object
   */
  saveShelfAndStorage() {
    if (this.shelfAndStorageFormGroup.valid && !this.nameAlreadyExists) {
      const item = this.optionDialog.data[WarehouseConstant.ITEM];
      const shelfToSave = this.shelfAndStorageFormGroup.value as Shelf;
      shelfToSave.Id = this.shelfAndStorageFormGroup.value['Id'];
      shelfToSave.Label = this.getShelfLabel();
      shelfToSave.Storage = new Array<Storage>();
      // prepare storage Label
      const storageToSave = new Storage();
      storageToSave.Label = this.getStorageLabel();
      storageToSave.IdResponsable = this.shelfAndStorageFormGroup.value['IdUser'];
      if (item){
      storageToSave.OldStorageLabel= this.getOldStorage(item.Label);
      shelfToSave.OldShelfLabel = this.getOldShelfLabel(item.Label);
    }
      shelfToSave.Storage.push(storageToSave);
      this.shelfService.addNewShelfStorage(shelfToSave).subscribe((data) => {
         if (data) {
          this.optionDialog.onClose();
          this.modalService.closeAnyExistingModalDialog();
          setTimeout(function() { window.location.reload(); }, NumberConstant.FIVE_HUNDRED);
         }
        }
      );
    } else {
      this.validationService.validateAllFormFields(this.shelfAndStorageFormGroup);
    }
  }

  /**
   * Create warehouse form
   * @param warehouse
   */
  private createAddWarehouseForm(warehouse?: Warehouse): void {
    this.warehouseFormGroup = this.formBuilder.group({
      Id: [warehouse ? warehouse.Id : NumberConstant.ZERO],
      WarehouseCode: [warehouse ? warehouse.WarehouseCode : SharedConstant.EMPTY],
      WarehouseName: [warehouse ? warehouse.WarehouseName : SharedConstant.EMPTY, Validators.required],
      WarehouseAdresse: [warehouse ? warehouse.WarehouseAdresse : SharedConstant.EMPTY],
      IdWarehouseParent: [warehouse ? warehouse.IdWarehouseParent : undefined, Validators.required],
      IdEmployee: [warehouse ? warehouse.IdResponsable : undefined],
      IdUser: [warehouse ? warehouse.IdUserResponsable : undefined],
      IsWarehouse: [warehouse ? warehouse.IsWarehouse.toString() : false],
      IsCentral: [warehouse ? warehouse.IsCentral.toString() : false]
    });
  }

  /**
   * Create shelfAndStorage form
   * @param shelf
   */
  private createAddShelfAndStorageForm(shelf?: Shelf): void {
    this.shelfAndStorageFormGroup = this.formBuilder.group({
      Id: [shelf ? shelf.Id : 0],
      Label: [shelf ? shelf.Label : SharedConstant.EMPTY, [Validators.required, shelfAndStoragePattern()]],
      IdWharehouse: [shelf ? shelf.IdWarehouse : SharedConstant.EMPTY, Validators.required],
      IdUser: [shelf ? shelf.IdResponsable : undefined],
      IsDefault: [shelf ? shelf.IsDefault : false],
      Storage: [shelf ? shelf.Storage : this.formBuilder.group({
        Id: [0],
        Label: [SharedConstant.EMPTY],
        IdShelf: [0],
        IsDefault: false
      })]
    });
    if(this.isUpdateMode && !this.hasUpdateShelfStoragePermission){
      this.Label.disable();
    }
  }


  /**Select warehouse Source */
  zoneFocused($event) {
    // Init list of warehouse data source
    $event.warehouseDataSource = [];
    $event.warehouseDataSource = $event.warehouseDataSource.concat($event.listOfAllWarehouseDataSource.filter(
      w => (w.IsCentral || !w.IsWarehouse)));

    $event.warehouseFiltredDataSource = [];
    $event.warehouseFiltredDataSource = $event.warehouseFiltredDataSource.concat($event.listOfAllWarehouseDataSource.filter(
      w => (w.IsCentral || !w.IsWarehouse)));

  }

  get IsWarehouse(): FormControl {
    return this.warehouseFormGroup.get(WarehouseConstant.IS_WAREHOUSE) as FormControl;
  }

  get IsCentral(): FormControl {
    return this.warehouseFormGroup.get(WarehouseConstant.IS_CENTRAL) as FormControl;
  }

  get IdWarehouseParent(): FormControl {
    return this.warehouseFormGroup.get(WarehouseConstant.ID_WAREHOUSE_PARENT) as FormControl;
  }

  get IdWarehouseParentFromShelfAndStorage(): FormControl {
    return this.shelfAndStorageFormGroup.get('IdWharehouse') as FormControl;
  }

  get Label(): FormControl {
    return this.shelfAndStorageFormGroup.get('Label') as FormControl;
  }

  get WarehouseName(): FormControl {
    return this.warehouseFormGroup.get(WarehouseConstant.WAREHOUSE_NAME) as FormControl;
  }

  private initWarehouseType() {
    const warehouseType = this.optionDialog.data[WarehouseConstant.VIEW_TYPE];
    switch (warehouseType) {
      case WarehouseConstant.IS_CENTRAL:
        this.IsCentral.setValue(true);
        this.IsWarehouse.setValue(false);
        break;
      case WarehouseConstant.IS_NOT_WAREHOUSE:
        this.IsCentral.setValue(false);
        this.IsWarehouse.setValue(false);
        this.isWarehouseDropdownTypeZoneAndCentral = true;
        break;
      case WarehouseConstant.IS_WAREHOUSE:
        this.IsCentral.setValue(false);
        this.IsWarehouse.setValue(true);
        this.isWarehouseDropdownTypeDepotAndCentral = true;
        break;
      default:
        break;
    }
  }

  handleSelectedWarehouse(event, isShelfAndStorage?) {
    if (event) {
      const IdWarehouse = isShelfAndStorage ? this.IdWarehouseParentFromShelfAndStorage.value : this.IdWarehouseParent.value;
      this.warehouseService.getById(IdWarehouse).subscribe(data => {
        if (data) {
          this.ecommerceWarehouse.IsEcommerce = data.IsEcommerce;
          this.ecommerceWarehouse.ForEcommerceModule = data.ForEcommerceModule;
        }
      });
      this.checkShelfAndStorageExistence();
    } else {
      this.ecommerceWarehouse.IsEcommerce = false;
      this.ecommerceWarehouse.ForEcommerceModule = false;
    }
  }

  private isShelfAndStroageType() {
    const viewType = this.optionDialog.data[WarehouseConstant.VIEW_TYPE];
    this.isShelfAndStorage = viewType === WarehouseConstant.IS_SHELF_AND_STORAGE;
    this.warehouseLabel = !this.isShelfAndStorage ? `${this.translate.instant(WarehouseConstant.CENTRAL)}/${this.translate.instant(WarehouseConstant.PARENT_ZONE)}` :
      this.translate.instant(WarehouseConstant.CENTRAl_WAREHOUSE_PARENT);
  }

  ngOnInit() {
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_WAREHOUSE);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_WAREHOUSE);
    this.hasAddShelfStoragePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SHELF_STORAGE);
    this.hasUpdateShelfStoragePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SHELF_STORAGE);
    this.hasUpdateZonePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ZONE);
    this.hasAddZonePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ZONE);
    this.isShelfAndStroageType();
    if (this.optionDialog.data) {
      if (this.optionDialog.data[WarehouseConstant.IS_UPDATE_MODE]) {
        this.isUpdateMode = true;
        const item = this.optionDialog.data[WarehouseConstant.ITEM];
        // Disabled Warehouse parent if selected element is the central warehouse
        if (item.IsCentral) {
          this.disabledWarehouseParent = true;
        }
        this.isCentralValue = item.IsCentral;
        this.isShelfAndStorage ? this.createAddShelfAndStorageForm(item) : this.createAddWarehouseForm(item);
      } else {
        this.isShelfAndStorage ? this.createAddShelfAndStorageForm() : this.createAddWarehouseForm();
        this.isUpdateMode = false;
        this.isCentralValue = false;
      }
    }
    if (this.isUpdateMode){
      this.disabledWarehouseParent = true;
    }
    this.initWarehouseType();
     if(this.warehouseFormGroup && this.IsWarehouse.value){
      this.updatePermission = this.hasUpdatePermission;
      this.addPermission = this.hasAddPermission;
    }else{
      this.updatePermission = this.hasUpdateZonePermission;
      this.addPermission = this.hasAddZonePermission;
    }
    if(!this.isShelfAndStorage && this.isUpdateMode && !this.updatePermission){
      this.WarehouseName.disable();
      this.warehouseFormGroup.controls["WarehouseAdresse"].disable();
    }
  }


  /**
   * get the 2 first caracteres from the Label
   * @private
   */
  private getShelfLabel() {
    return this.Label.value.substring(NumberConstant.ZERO, this.Label.value.length - NumberConstant.THREE);
  }

  /**
   * get the last 3 caracteres from the Label
   * @private
   */
  private getStorageLabel() {
    return this.Label.value.replace(this.getShelfLabel(), SharedConstant.EMPTY);
  }
  /**
   * get storage label from oldStorage
   * @param oldStorage
   * @returns
   */
  private getOldStorage (oldStorage: string){
    return oldStorage.replace(oldStorage.substring(NumberConstant.ZERO, this.Label.value.length - NumberConstant.THREE), SharedConstant.EMPTY);
  }
  /**
   * get shelf label from oldShelf
   */
  private getOldShelfLabel(oldShelf: string) {
    return oldShelf.substring(NumberConstant.ZERO, oldShelf.length - NumberConstant.THREE);
  }

  checkShelfAndStorageExistence() {
    if (this.isShelfAndStorage && this.Label.value && this.IdWarehouseParentFromShelfAndStorage.value) {
      const shelf = this.shelfAndStorageFormGroup.value as Shelf;
      shelf.Label = this.getShelfLabel();
      shelf.Storage = new Array<Storage>();
      const storage = new Storage();
      storage.Label = this.getStorageLabel();
      shelf.Storage.push(storage);
      this.shelfService.checkShelfAndStorageExistenceInWarehouse(shelf).toPromise().then(result => {
        this.nameAlreadyExists = result;
      });
    } else if (!this.isShelfAndStorage && this.WarehouseName.value && this.IdWarehouseParent.value) {
      const warehouse = this.warehouseFormGroup.value as Warehouse;
      this.warehouseService.checkWarehouseNameExistence(warehouse).toPromise().then(result => {
        this.nameAlreadyExists = result;
      });
    }
  }
}

