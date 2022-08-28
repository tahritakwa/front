import { Component, OnInit, ComponentRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Warehouse } from '../../../models/inventory/warehouse.model';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { WarehouseService } from '../../services/warehouse/warehouse.service';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { WarehouseConstant } from '../../../constant/inventory/warehouse.constant';
import { StockDocumentsService } from '../../services/stock-documents/stock-documents.service';

@Component({
  selector: 'app-popup-inventory-detailsvalidate',
  templateUrl: './popup-inventory-detailsvalidate.component.html',
  styleUrls: ['./popup-inventory-detailsvalidate.component.scss']
})
export class PopupInventoryDetailsValidateComponent implements OnInit, IModalDialog {
  /*
 * Form Group
 */
popupinventoryFormGroup: FormGroup;
  /*
   * is updateMode
   */
  public isUpdateMode: boolean;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public disabledWarehouseParent: boolean;
  constructor(private formBuilder: FormBuilder, private validationService: ValidationService,
    public warehouseService: WarehouseService,public stockDocumentService: StockDocumentsService, private modalService: ModalDialogInstanceService) { }




  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
  }

  save() {
    if (this.popupinventoryFormGroup.valid) {
      // Temporary code
      const valueToSend = this.popupinventoryFormGroup.value as Warehouse;
      valueToSend.IdResponsable = this.popupinventoryFormGroup.value[WarehouseConstant.ID_EMPLOYEE];
      this.warehouseService.save(valueToSend, !this.isUpdateMode).subscribe(() => {
        this.optionDialog.onClose();
        this.modalService.closeAnyExistingModalDialog();
      }
      );
    } else {
      this.validationService.validateAllFormFields(this.popupinventoryFormGroup);
    }
  }

  /**
  * Create Bonus form
  * @param bonus
  */
  private createAddWarehouseForm(IdWarehouseParent): void {
    this.popupinventoryFormGroup = this.formBuilder.group({
      Id: [0],
      WarehouseCode: [''],
      WarehouseName: ['', Validators.required],
      WarehouseAdresse: [''],
      IdWarehouseParent: [IdWarehouseParent ? IdWarehouseParent : undefined],
      IdEmployee: [undefined],
      IsWarehouse: ['false'],
      IsCentral: [IdWarehouseParent ? false : true]
    });
  }

  private createEditWarehouseForm(item: Warehouse): void {
    this.popupinventoryFormGroup = this.formBuilder.group({
      Id: [item.Id],
      WarehouseCode: [item.WarehouseCode],
      WarehouseName: [item.WarehouseName, Validators.required],
      WarehouseAdresse: [item.WarehouseAdresse],
      IdWarehouseParent: [item.IdWarehouseParent],
      IdEmployee: [item.IdResponsable],
      IsWarehouse: [item.IsWarehouse.toString()],
      IsCentral: [item.IsCentral.toString()]
    });
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

  ngOnInit() {
    if (this.optionDialog.data) {
      if (this.optionDialog.data[WarehouseConstant.IS_UPDATE_MODE]) {
        this.isUpdateMode = true;
        // Disabled Warehouse parent if selected element is the central warehouse
        if (this.optionDialog.data[WarehouseConstant.ITEM] && this.optionDialog.data[WarehouseConstant.ITEM].IsCentral) {
          this.disabledWarehouseParent = true;
        }
        this.createEditWarehouseForm(this.optionDialog.data[WarehouseConstant.ITEM]);
      } else {
        this.isUpdateMode = false;
        this.createAddWarehouseForm(this.optionDialog.data[WarehouseConstant.ITEM] ?
          this.optionDialog.data[WarehouseConstant.ITEM].Id : undefined);
      }
    }
  }

}
