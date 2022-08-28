import { Component, HostListener, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridComponent, PagerSettings } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Company } from '../../../models/administration/company.model';
import { Currency } from '../../../models/administration/currency.model';
import { OperationStatusEnumerator } from '../../../models/enumerators/operation-status.enum';
import { OperationValidateByEnumerator } from '../../../models/enumerators/operation-validate-by.enum';
import { OperationKitOperation } from '../../../models/garage/operation-kit-operation.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { OperationKitService } from '../../services/operation-kit/operation-kit.service';
import { OperationKitOperationPopUpComponent } from '../operation-kit-operation-pop-up/operation-kit-operation-pop-up.component';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
const LIST_OF_OPERATION = 'LIST_OF_OPERATION';

@Component({
  selector: 'app-operation-for-kit-operation',
  templateUrl: './operation-for-kit-operation.component.html',
  styleUrls: ['./operation-for-kit-operation.component.scss']
})
export class OperationForKitOperationComponent implements OnInit {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  @Input() idOperationKit: number;
  @Input() isModal;
  @ViewChild('grid') grid: GridComponent;
  @Input() listOperation: any[];
  @Input() operationListIdsToIgnore: any[];
  @Input() isFromItem = true;
  @Input() hasUpdatePermission: boolean;
  // form group operation
  gridFormGroup: FormGroup;
  // enums
  operationValidateByEnumerator = OperationValidateByEnumerator;
  operationStatusEnumerator = OperationStatusEnumerator;

  language: string;
  companyCurrency: Currency;
 /**
   * is updateMode
   */
  private editedRowIndex: number;
  private editedRow: any;
  isEditingMode = false;

  isShortcutAddbuttonVisible = false;

  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.ID_OPERATION_NAVIGATION_NAME,
      title: GarageConstant.OPERATION,
      filterable: true,
      tooltip: GarageConstant.OPERATION
    },
    {
      field: GarageConstant.DURATION,
      title: GarageConstant.EXPECTED_DURATION_TITLE,
      filterable: true,
      tooltip: GarageConstant.EXPECTED_DURATION_TITLE
    },
    {
      field: GarageConstant.HT_PRICE,
      title: GarageConstant.HT_AMOUNT_TITLE,
      filterable: true,
      tooltip: GarageConstant.HT_AMOUNT_TITLE
    }
  ];

  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      filters: [],
      logic: 'and'
    },
    group: []
  };

  gridSettings: GridSettings = { state: this.gridState, columnsConfig: this.columnsConfig };

  constructor(private swalWarrings: SwalWarring, private fb: FormBuilder, private companyService: CompanyService,
    private validationService: ValidationService, public formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef, private modalService: ModalDialogInstanceService,
      private operationKitService: OperationKitService, private localStorageService : LocalStorageService, private translateService: TranslateService,
      private growlService: GrowlService) {
        this.language = this.localStorageService.getLanguage();
    }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event) {
    const keyName = event.key;
    if (keyName === KeyboardConst.F2 && !this.isFromItem) {
      this.onSearchClicked();
    }
    if (keyName === KeyboardConst.ESCAPE && !this.isFromItem) {
      this.modalService.closeAnyExistingModalDialog();
    }
  }

  ngOnInit() {
    this.companyService.getCurrentCompany().subscribe((data: Company) => {
      this.companyCurrency = data.IdCurrencyNavigation;
    });
    if (this.isModal) {
      this.getOperationListByOperationKit();
    }
    this.processGridData();
  }

  /**
    * Create operation for kit add form
   */
  createFormGroup(dataItem?: any) {
    this.gridFormGroup = this.fb.group({
      Id: [dataItem ? dataItem.Id : 0],
      IdOperationKit: [dataItem ? dataItem.IdOperationKit : this.idOperationKit],
      IdOperation: [dataItem ? dataItem.IdOperation : undefined, Validators.required],
      Duration: [{
        value: dataItem ? dataItem.Duration : '',
        disabled: true
      }],
      Htprice: [{
        value: dataItem ? dataItem.Htprice : '',
        disabled: true
      }]
    });
  }

  addHandler({ sender }) {
    if (!this.isEditingMode) {
      this.closeEditor();
      this.createFormGroup();
      this.grid.addRow(this.gridFormGroup);
      this.editedRow = this.gridFormGroup.getRawValue();
      this.isEditingMode = true;
      this.isShortcutAddbuttonVisible = true;
      this.isFromItem = false;
    }
  }

  editHandler({ isEdited, dataItem, rowIndex }, SetedValue?: boolean, data?: any) {
    if (!this.isEditingMode && this.hasUpdatePermission) {
      this.isEditingMode = true;
      this.editedRowIndex = rowIndex;
      this.editedRow = dataItem;
      const indexFromOperationIdsToIgnore = this.operationListIdsToIgnore.findIndex((x) => x === this.editedRow.IdOperation);
      this.operationListIdsToIgnore.splice(indexFromOperationIdsToIgnore, NumberConstant.ONE);
      this.createFormGroup(this.editedRow);
      this.grid.editRow(rowIndex, this.gridFormGroup);
    }
  }

  saveHandler({ dataItem, formGroup, isNew, rowIndex, sender }) {
    if ((formGroup as FormGroup).valid) {
      this.editedRow = Object.assign({}, this.editedRow, formGroup.getRawValue());
      this.editedRow.Htprice = Number.parseFloat(this.editedRow.Htprice);
      const index = this.listOperation.findIndex(x => x.IdOperation === this.editedRow.IdOperation);
      if (isNew) {
        if (index >= 0) {
          let duplicateOperationMessage = this.translateService.instant(GarageConstant.DUPLICATED_OPERATION);
          duplicateOperationMessage = duplicateOperationMessage.replace('{Operation}', this.editedRow.IdOperationNavigation.Name);
          this.growlService.ErrorNotification(duplicateOperationMessage);
        } else {
          this.listOperation.unshift(this.editedRow);
        }
      } else {
        const oldIndex = this.listOperation.findIndex(x => x.IdOperation === dataItem.IdOperation);
        if (index >= 0 && (index === oldIndex)) {
          this.listOperation[index] = this.editedRow;
        }
      }
      this.operationListIdsToIgnore.unshift(this.editedRow.IdOperation);
      this.processGridData();
      this.closeEditor();
      this.isShortcutAddbuttonVisible = false;
    } else {
      this.validationService.validateAllFormFields(this.gridFormGroup);
    }
  }

  cancelHandler({ dataItem, formGroup, isNew, rowIndex, sender }) {
    if (!isNew) {
      this.operationListIdsToIgnore.unshift(dataItem.IdOperation);
    }
    this.isShortcutAddbuttonVisible = false;
    this.closeEditor();
  }

  public removeHandler({ dataItem, rowIndex }) {
    if (!this.isEditingMode) {
      this.swalWarrings.CreateSwal().then((result: { value: any; }) => {
        if (result.value) {
          const index = this.listOperation.findIndex((x) => x.IdOperation === dataItem.IdOperation);
          this.listOperation.splice(index, NumberConstant.ONE);
          const indexFromOperationIdsToIgnore = this.operationListIdsToIgnore.findIndex((x) => x === dataItem.IdOperation);
          this.operationListIdsToIgnore.splice(indexFromOperationIdsToIgnore, NumberConstant.ONE);
          this.gridSettings.state.skip = (this.listOperation.length % this.gridSettings.state.take ) !== 0 ?
          this.gridSettings.state.skip : this.gridSettings.state.skip - this.gridSettings.state.take;
          this.gridSettings.state.skip = (this.gridSettings.state.skip < 0 ) ? 0 : this.gridSettings.state.skip;
          this.processGridData();
        }
      });
    }
  }
  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.gridFormGroup = undefined;
    this.isEditingMode = false;
  }

  onSelectOperation($event) {
    if ($event) {
      const operation = Object.assign({}, $event);
      this.editedRow['IdOperationNavigation'] = operation;
      this.editedRow['Htprice'] = operation.Htprice;
      this.editedRow.IdOperationNavigation = operation;
      this.gridFormGroup.controls.Duration.setValue(operation.ExpectedDuration);
      this.gridFormGroup.controls.Htprice.setValue(operation.Htprice);
    } else {
      this.editedRow = {};
      this.editedRow.IdOperationNavigation = undefined;
      this.gridFormGroup.controls.Duration.setValue(undefined);
      this.gridFormGroup.controls.Htprice.setValue(undefined);
    }
    this.isFromItem = true;
  }

  onSearchClicked() {
    const TITLE = LIST_OF_OPERATION;
    const data = {};
    data['operationSelected'] = this.listOperation;
    data['listOperationIdsToIgnore'] = this.operationListIdsToIgnore;
    data['idOperationKit'] = this.idOperationKit;
    this.formModalDialogService.openDialog(TITLE, OperationKitOperationPopUpComponent, this.viewRef,
      this.initOperationGridData.bind(this), data, true, SharedConstant.MODAL_DIALOG_SIZE_L);
      this.isFromItem = true;
  }

  initOperationGridData(data) {
    this.isShortcutAddbuttonVisible = false;
    this.processGridData();
    this.closeEditor();
  }

  getOperationListByOperationKit() {
    this.operationKitService.getOperationKitByCondiction(this.idOperationKit).subscribe((data) => {
      if (data.OperationKitOperation) {
        this.listOperation = [];
        data.OperationKitOperation.forEach((x: OperationKitOperation) => {
          this.listOperation.unshift(new OperationKitOperation(x));
          this.processGridData();
        });
      }
    });
  }

  processGridData() {
    if (this.listOperation !== undefined) {
      const operations = Object.assign([], this.listOperation);
      this.gridSettings.gridData = process(operations, this.gridSettings.state);
    }
  }

  dataStateChange($event: State) {
    this.gridSettings.state = $event;
    this.processGridData();
  }

  getListOperation(): any[] {
     return this.listOperation;
  }

}
