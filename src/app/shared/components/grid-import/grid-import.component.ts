import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { State } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PageChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { isNullOrUndefined } from 'util';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { TranslateService } from '@ngx-translate/core';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { ModelDropdownComponent } from '../../../garage/components/model-dropdown/model-dropdown.component';
@Component({
  selector: 'app-grid-import',
  templateUrl: './grid-import.component.html',
  styleUrls: ['./grid-import.component.scss']
})
export class GridImportComponent implements OnInit {
  @ViewChild('vehicleModelViewChild') vehicleModelViewChild: ModelDropdownComponent;
   // pager settings
   pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  @Input()
  importResult: Array<any>;
  @Input()
  saveImportedData: Function;
  @Input() formGroup: FormGroup;
  @Input() formGroupContract: FormGroup;
  @Input() importColumnsConfig: ColumnSettings[];
  @Input() importColumnsContractConfig: ColumnSettings[];
  public dateFormat: string = this.translate.instant(SharedConstant.DATE_FORMAT);

  private editedRowIndex: number;
  private editedContractRowIndex: number;
  private ObjectList = [];
  private editedRow: Object;
  public isRequired = false;
  public userRoleIds: any = [
    {
      index: 0,
      listIds: []
    }
  ];

  public gridState: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: [],
  };

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.loadItems();
    this.gridSettings.columnsConfig = this.importColumnsConfig;
  }
  /**
   * page Change
   * @param event
   */
  public pageChange(event: PageChangeEvent): void {
    this.gridState.skip = event.skip;
    this.loadItems();
  }
  /**
   * load Items
   * */
  private loadItems(): void {
    this.gridSettings.gridData = {
      data: this.importResult.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
      total: this.importResult.length
    };
  }
  /**
   * remove employee line Handler
   * @param param0
   */
  public removeHandler({ dataItem }) {
    this.importResult = this.importResult.filter(obj => obj !== dataItem);
    this.loadItems();
  }
  /**
   * on Save Click
   * */
  public onSaveClick() {
    this.importResult.forEach(ele => {
      if(!isNullOrUndefined(ele.Contract)){
      ele.Contract.forEach(contract => {
        contract.Contract = [];
      });
      }
    });
    this.saveImportedData(this.importResult);
  }
  /**
  * Close the editor
  * @param grid
  * @param rowIndex
  */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.editedContractRowIndex = undefined;
    this.editedRow = undefined;
  }
  /**
   * @param param0
   */
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }
  /**
    *
    * @param param
    */
  public saveHandler({ sender, rowIndex, formGroup }) {
    if ((formGroup as FormGroup).valid) {
      if (this.editedRow) {
        if (formGroup.value && formGroup.value.Contract !== null) {
          formGroup.value.Contract = this.ObjectList;
        }
        Object.assign(this.editedRow, formGroup.value);
      }
      this.editedRowIndex = undefined;
      this.editedContractRowIndex  = undefined;
      sender.closeRow(rowIndex);
    }
  }
  /**
     * Edit the column on which the user clicked
     * @param param
     */
  public editHandler({ sender, rowIndex, columnIndex, dataItem }) {
    this.closeEditor(sender);
    this.editedRowIndex = rowIndex;
    this.editedRow = dataItem;
    if (!isNullOrUndefined(dataItem.BirthDate)) {
      dataItem.BirthDate = new Date(dataItem.BirthDate);
    }
    this.formGroup.patchValue(dataItem);
     this.ObjectList = dataItem.Contract;
     if (!isNullOrUndefined(columnIndex)) {
      sender.editCell(rowIndex, columnIndex, this.formGroup);
     }
    sender.editRow(rowIndex, this.formGroup);
  }
  public cellCloseHandler({ dataItem }) {
    this.editedRowIndex = undefined;
      Object.assign(dataItem, this.formGroup.value);
      dataItem.Contract = this.ObjectList;
  }
  public editContractHandler({ sender, rowIndex, columnIndex, dataItem }) {
    this.closeEditor(sender);
    this.editedContractRowIndex = rowIndex;
    this.editedRow = dataItem;
    if (!isNullOrUndefined(dataItem.StartDate)) {
    dataItem.StartDate = new Date(dataItem.StartDate);
    }
    if (!isNullOrUndefined(dataItem.EndDate)) {
    dataItem.EndDate = new Date(dataItem.EndDate);
    }
    this.formGroupContract.patchValue(dataItem);
    if (!isNullOrUndefined(columnIndex)) {
      sender.editCell(rowIndex, columnIndex, this.formGroupContract);
    }
    sender.editRow(rowIndex, this.formGroupContract);
  }
  public cellContractCloseHandler({ dataItem }) {
    this.editedContractRowIndex = undefined;
    Object.assign(dataItem, this.formGroupContract.value);
  }
  public changeRequired(hasEndDate, item) {
    if (hasEndDate) {
      item.IdContractTypeNavigation = item.ContractType;
      this.isRequired = true;
    } else {
      this.isRequired = false;
    }
  }
  public isHasEndDate(item) {
     const idx = isNullOrUndefined(this.editedContractRowIndex) ? NumberConstant.ZERO : this.editedContractRowIndex;
     return item.Contract[idx] && item.Contract[idx].ContractType && item.Contract[idx].ContractType.HasEndDate;
  }
  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.editedContractRowIndex !== undefined;
}
  changedSelectedBank($event){
    this.editedRow[SharedConstant.BANK] = $event;
  }
  changedSelectedRolesNames($event){
    this.editedRow[SharedConstant.ROLES_NAMES] = $event;
  }
  changedSelectedCountry($event){
    this.editedRow[SharedConstant.COUNTRY] = $event;
  }
  changedSelectedContractType($event){
    this.editedRow[SharedConstant.CONTRACT_TYPE] = $event;
  }
  changedSelectedSalaryStructure($event){
    this.editedRow[SharedConstant.SALARY_STRUCTURE] = $event;
  }
  changedSelectedCnss($event){
    this.editedRow[SharedConstant.CNSS] = $event;
  }
  changedSelectedCurrency($event) {
    this.editedRow[SharedConstant.CURRENCY] = $event;
  }
  changedSelectedGroupTiers($event) {
    this.editedRow[SharedConstant.TAXE_GROUP] = $event;
  }
  changedSelectedBrand($event) {
    this.editedRow[GarageConstant.ID_VEHICLE_BRAND] = $event;
    this.formGroup.controls.IdVehicleModel.setValue(undefined);
    if ($event) {
      this.vehicleModelViewChild.setModel($event.Id);
    } else {
      this.vehicleModelViewChild.setModel(0);
    }
  }
}
