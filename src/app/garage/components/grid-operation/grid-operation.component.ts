import { Component, HostListener, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Currency } from '../../../models/administration/currency.model';
import { ReducedOperation } from '../../../models/garage/reduced-operation.model';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { OperationService } from '../../services/operation/operation.service';
import { MachineOperationsComponent } from '../machine-operations/machine-operations.component';
const LIST_OF_OPERATION = 'LIST_OF_OPERATION';

@Component({
  selector: 'app-grid-operation',
  templateUrl: './grid-operation.component.html',
  styleUrls: ['./grid-operation.component.scss']
})
export class GridOperationComponent implements OnInit {

  @Input() listOperation: any[];
  @Input() listOperationIdsToIgnore: Array<number>;
  @Input() hasUpdatePermission: boolean;

  @ViewChild(GridComponent) private grid: GridComponent;
  private editedRowIndex: number;
  formGroup: FormGroup;
  isEditingMode = false;
  isRemoved = false;
  isShortcutAddbuttonVisible = false;
  selectedOperation: ReducedOperation;
  currency: Currency;

  /**
   * Operation Grid columns
   */
  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.NAME,
      title: GarageConstant.OPERATION,
      filterable: true,
    },
    {
      field: GarageConstant.OPERATION_TYPE_NAME,
      title: GarageConstant.OPERATION_TYPE_TITLE,
      filterable: true,
    },
    {
      field: GarageConstant.EXPECTED_DURATION_FORMAT,
      title: GarageConstant.EXPECTED_DURATION_TITLE,
      filterable: true,
    }
  ];

  /**
     * Grid settings
     **/

  constructor(private fb: FormBuilder, private validationService: ValidationService, private modalService: ModalDialogInstanceService,
    public formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef,
    private translateService: TranslateService, private operationService: OperationService, private companyService: CompanyService) { }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event) {
    const keyName = event.key;
    if (keyName === KeyboardConst.F2) {
      this.onSearchClicked();
    }
    if (keyName === KeyboardConst.ESCAPE) {
      this.modalService.closeAnyExistingModalDialog();
    }
  }

  ngOnInit() {
  }

  createFormGroup(dataItem?) {
    this.formGroup = this.fb.group({
      Id: [dataItem ? dataItem.Id : undefined, Validators.required],
      Name: [dataItem ? dataItem.Name : ''],
      ExpectedDurationFormat: [{ value: dataItem ? dataItem.ExpectedDurationFormat : '', disabled: true }],
      OperationTypeName: [{
        value: dataItem ? dataItem.OperationTypeName : '', disabled: true
      }],
    });
  }

  addLine() {
    this.createFormGroup();
    this.grid.addRow(this.formGroup);
    this.isEditingMode = true;
    this.isShortcutAddbuttonVisible = true;
  }

  lineClickHandler({ isEdited, dataItem, rowIndex }, SetedValue?: boolean, data?: any): void {
    if (!this.isEditingMode && this.hasUpdatePermission) {
      if (this.isRemoved) {
        this.isRemoved = false;
        return;
      }
      const index = this.listOperationIdsToIgnore.findIndex((x) => x === dataItem.Id);
      this.listOperationIdsToIgnore.splice(index, NumberConstant.ONE);
      this.isEditingMode = true;
      this.editedRowIndex = rowIndex;
      this.selectedOperation = dataItem;
      this.createFormGroup(dataItem);
      this.grid.editRow(rowIndex, this.formGroup);
    }
  }

  saveCurrent({ dataItem, formGroup, isNew, rowIndex, sender }) {
    if (this.formGroup.valid) {
      const operation = this.selectedOperation;
      if (isNew) {
        this.listOperation.unshift(operation);
      } else {
        const index = this.listOperation.findIndex(x => x.Id === dataItem.Id);
        this.listOperation[index] = operation;
      }
      this.listOperationIdsToIgnore.unshift(operation.Id);
      this.closeEditor();
      this.isShortcutAddbuttonVisible = false;
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  onSelectOperation($event) {
    if ($event) {
      this.selectedOperation = Object.assign({}, $event);
      this.selectedOperation.OperationTypeName = $event.IdOperationTypeNavigation ? $event.IdOperationTypeNavigation.Name : '';
      this.selectedOperation.ExpectedDurationFormat =
        this.operationService.getExpectedDuration(this.selectedOperation, this.translateService);
      this.formGroup.patchValue(this.selectedOperation);
    } else {
      this.formGroup.reset();
    }
  }

  removeLine(event) {
    if (!this.isEditingMode) {
      const index = this.listOperation.findIndex(x => x.Id === event.dataItem.Id);
      this.listOperation.splice(index, NumberConstant.ONE);
      const indexFromIdsToIgnore = this.listOperationIdsToIgnore.findIndex((x) => x === event.dataItem.Id);
      this.listOperationIdsToIgnore.splice(indexFromIdsToIgnore, NumberConstant.ONE);
      this.editedRowIndex = event.rowIndex;
      this.closeEditor();
      // //used to close nextline
      this.isRemoved = true;
    }
  }

  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.isEditingMode = false;
  }

  public cancelHandler({ dataItem, formGroup, isNew, rowIndex, sender }): void {
    if (!isNew) {
      this.listOperationIdsToIgnore.unshift(dataItem.Id);
    }
    this.isShortcutAddbuttonVisible = false;
    this.closeEditor();
  }


  onSearchClicked() {
    const TITLE = LIST_OF_OPERATION;
    const data = {};
    data['operationSelected'] = this.listOperation;
    data['listOperationIdsToIgnore'] = this.listOperationIdsToIgnore;

    this.formModalDialogService.openDialog(TITLE, MachineOperationsComponent, this.viewRef,
      this.initOperationGridData.bind(this), data, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  initOperationGridData(data) {
    this.isShortcutAddbuttonVisible = false;
    this.closeEditor();
  }

}
