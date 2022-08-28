import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GridComponent, PagerSettings } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Currency } from '../../../models/administration/currency.model';
import { OperationStatusEnumerator } from '../../../models/enumerators/operation-status.enum';
import { OperationValidateByEnumerator } from '../../../models/enumerators/operation-validate-by.enum';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { InterventionOperationEditorComponent } from '../intervention-operation-editor/intervention-operation-editor.component';
const SPACE = ' ';
@Component({
  selector: 'app-operation-to-be-performed',
  templateUrl: './operation-to-be-performed.component.html',
  styleUrls: ['./operation-to-be-performed.component.scss']
})
export class OperationToBePerformedComponent implements OnInit {
  @ViewChild('grid') grid: GridComponent;
  @Input() interventionOperationsList: any[];
  @Input() repairOrderOperationsList: any[];
  @Input() idIntervention: number;
  @Input() idRepairOrder: number;
  @Input() companyCurrency: Currency;
  @Input() language: string;
  @Input() operationListIdsToIgnore: any[];
  @Input() isUpdateMode: boolean;
  @Input() isInterventionCompleted: boolean;
  @Input() isRepairOrderValid: boolean;
  @Input() isForRepairOrder: boolean;
  @Output() operationsChanged: EventEmitter<any> = new EventEmitter();
  operationStatusEnumerator = OperationStatusEnumerator;
  operationValidateByEnumerator = OperationValidateByEnumerator;
  gridFormGroup: FormGroup;
  private editedRowIndex: number;
  private editedRow: any;
  isEditingMode = false;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.ID_OPERATION_NAVIGATION_NAME,
      title: GarageConstant.OPERATION,
      filterable: true,
      tooltip: GarageConstant.OPERATION
    },
    {
      field: GarageConstant.VALIDATE_BY,
      filterable: true,
      tooltip: GarageConstant.VALIDATE_BY_TITLE
    },
    {
      field: GarageConstant.DURATION,
      title: GarageConstant.EXPECTED_DURATION_TITLE,
      filterable: true,
      tooltip: GarageConstant.EXPECTED_DURATION_TITLE
    },
    {
      field: GarageConstant.HT_PRICE,
      title: GarageConstant.HT_PRICE_TITLE,
      filterable: true,
      tooltip: GarageConstant.HT_PRICE_TITLE
    },
    {
      field: GarageConstant.TTC_PRICE,
      title: GarageConstant.TTC_AMOUNT_TITLE,
      filterable: true,
      tooltip: GarageConstant.TTC_AMOUNT_TITLE
    },
    {
      field: GarageConstant.STATUS,
      title: GarageConstant.STATE_TITLE,
      filterable: true,
      tooltip: GarageConstant.STATE_TITLE
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

  gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(private fb: FormBuilder, private translateService: TranslateService,
    private growlService: GrowlService, private formModalDialogService: FormModalDialogService,
    private viewContainerRef: ViewContainerRef, private validationService: ValidationService,
    private swalWarrings: SwalWarring) { }

  ngOnInit() {
    this.processGridData(); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.processGridData();
  }

  processGridData() {
    if (!this.isForRepairOrder) {
      if (this.interventionOperationsList !== undefined) {
        const interventionOperations = Object.assign([], this.interventionOperationsList);
        this.gridSettings.gridData = process(interventionOperations, this.gridSettings.state);
      }
    } else {
      if (this.repairOrderOperationsList !== undefined) {
        const repairOrderOperations = Object.assign([], this.repairOrderOperationsList);
        this.gridSettings.gridData = process(repairOrderOperations, this.gridSettings.state);
      }
    }
  }

  dataStateChange($event: State) {
    this.gridSettings.state = $event;
    this.processGridData();
  }

  createFormGroupForInterventionOperation(dataItem?: any) {
    this.gridFormGroup = this.fb.group({
      Id: [dataItem ? dataItem.Id : 0],
      IdIntervention: [dataItem ? dataItem.IdIntervention : this.idIntervention],
      IdOperation: [dataItem ? dataItem.IdOperation : undefined, Validators.required],
      Status: [dataItem ? dataItem.Status : this.operationStatusEnumerator.New, Validators.required],
      ValidateBy: [dataItem ? dataItem.ValidateBy : this.operationValidateByEnumerator.ValidateByUser, Validators.required],
      IdOperationNavigation: [dataItem ? dataItem.IdOperationNavigation : ''],
      Duration: [dataItem ? dataItem.Duration : ''],
      Ttcprice: [dataItem ? dataItem.Ttcprice : ''],
      Description: [dataItem ? dataItem.Description : '']
    });
  }

  createFormGroupForRepairOrderOperation(dataItem?: any) {
    this.gridFormGroup = this.fb.group({
      Id: [dataItem ? dataItem.Id : 0],
      IdRepairOrder: [dataItem ? dataItem.IdRepairOrder : this.idRepairOrder],
      IdOperation: [dataItem ? dataItem.IdOperation : undefined, Validators.required],
      IdOperationNavigation: [dataItem ? dataItem.IdOperationNavigation : ''],
      Duration: [dataItem ? dataItem.Duration : ''],
      Htprice: [dataItem ? dataItem.Htprice : '']
    });
  }

  addHandler({ sender }) {
    if (!this.isEditingMode) {
      this.closeEditor();
      if (!this.isForRepairOrder) {
        this.createFormGroupForInterventionOperation();
      }
      else {
        this.createFormGroupForRepairOrderOperation();
      }
      this.grid.addRow(this.gridFormGroup);
      this.editedRow = this.gridFormGroup.getRawValue();
      this.isEditingMode = true;
    }
  }

  editHandler({ isEdited, dataItem, rowIndex }, SelectedValue?: boolean, data?: any) {
    if (!this.isEditingMode) {
      this.isEditingMode = true;
      this.editedRowIndex = rowIndex;
      this.editedRow = dataItem;
      const indexFromOperationIdsToIgnore = this.operationListIdsToIgnore.findIndex((x) => x === this.editedRow.IdOperation);
      this.operationListIdsToIgnore.splice(indexFromOperationIdsToIgnore, NumberConstant.ONE);
      if (!this.isForRepairOrder) {
        this.createFormGroupForInterventionOperation(this.editedRow);
      } else {
        this.createFormGroupForRepairOrderOperation(this.editedRow);
      }
      this.grid.editRow(rowIndex, this.gridFormGroup);
    }
  }

  saveHandler({ dataItem, formGroup, isNew, rowIndex, sender }) {
    if ((formGroup as FormGroup).valid) {
      this.editedRow = Object.assign({}, this.editedRow, formGroup.getRawValue());
      this.editedRow.Ttcprice = Number.parseFloat(this.editedRow.Ttcprice);
      this.editedRow.Htprice = Number.parseFloat(this.editedRow.Htprice);
      if (this.isForRepairOrder || (!this.isForRepairOrder && (formGroup.controls.Status.value !== this.operationStatusEnumerator.Canceled &&
        formGroup.controls.Status.value !== this.operationStatusEnumerator.Blocked))) {
        this.operationsChanged.emit(true);
        let index = -1;
        if (!this.isForRepairOrder) {
          index = this.interventionOperationsList.findIndex(x => x.IdOperation === this.editedRow.IdOperation);
        } else {
          index = this.repairOrderOperationsList.findIndex(x => x.IdOperation === this.editedRow.IdOperation);
        }
        if (isNew) {
          if (index >= 0) {
            let duplicateOperationMessage = this.translateService.instant(GarageConstant.DUPLICATED_OPERATION);
            duplicateOperationMessage = duplicateOperationMessage.replace('{Operation}', this.editedRow.IdOperationNavigation.Name);
            this.growlService.ErrorNotification(duplicateOperationMessage);
          } else {
            if (!this.isForRepairOrder) {
              this.interventionOperationsList.unshift(this.editedRow);
            } else {
              this.repairOrderOperationsList.unshift(this.editedRow);
            }
          }
        } else {
          let oldIndex = -1;
          if (!this.isForRepairOrder) {
            oldIndex = this.interventionOperationsList.findIndex(x => x.IdOperation === dataItem.IdOperation);
            if (index >= 0 && (index === oldIndex)) {
              this.interventionOperationsList[index] = this.editedRow;
            }
          } else {
            oldIndex = this.repairOrderOperationsList.findIndex(x => x.IdOperation === dataItem.IdOperation);
            if (index >= 0 && (index === oldIndex)) {
              this.repairOrderOperationsList[index] = this.editedRow;
            }
          }
        }
        this.operationListIdsToIgnore.unshift(this.editedRow.IdOperation);
        this.processGridData();
        this.closeEditor();
      } else {
        const title = 'Note';
        const data = { description: this.editedRow.Description, isNew: isNew, idOldOperation: dataItem.IdOperation };
        this.formModalDialogService.openDialog(title, InterventionOperationEditorComponent,
          this.viewContainerRef, this.editorOnClose.bind(this), data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
      }
    } else {
      this.validationService.validateAllFormFields(this.gridFormGroup);
    }
  }

  cancelHandler({ dataItem, formGroup, isNew, rowIndex, sender }) {
    if (!isNew) {
      this.operationListIdsToIgnore.unshift(dataItem.IdOperation);
    }
    this.closeEditor();
  }

  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.gridFormGroup = undefined;
    this.isEditingMode = false;
  }

  editorOnClose(data) {
    if (data.description) {
      this.editedRow.Description = data.description;
      this.changeData(data);
      this.closeEditor();
    }
  }

  changeData(data) {
    // Update the dataGrid for operaton to be performed
    if (!this.isForRepairOrder) {
      if (data.isNew) {
        this.interventionOperationsList.unshift(this.editedRow);
      } else {
        const index = this.interventionOperationsList.findIndex(x => x.IdOperation === data.idOldOperation);
        if (index >= 0) {
          this.interventionOperationsList[index] = this.editedRow;
        }
      }
    } else {
      if (data.isNew) {
        this.repairOrderOperationsList.unshift(this.editedRow);
      } else {
        const index = this.repairOrderOperationsList.findIndex(x => x.IdOperation === data.idOldOperation);
        if (index >= 0) {
          this.repairOrderOperationsList[index] = this.editedRow;
        }
      }
    }
    this.operationListIdsToIgnore.unshift(this.editedRow.IdOperation);
    this.processGridData();
  }


  openDetail(dataItem) {
    const title = 'Note';
    const data = { description: dataItem.Description, dataItem: dataItem };
    this.formModalDialogService.openDialog(title, InterventionOperationEditorComponent,
      this.viewContainerRef, this.changeDescription.bind(this), data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  changeDescription(data) {
    data.dataItem.Description = data.description;
  }


  onSelectOperation($event) {
    if ($event) {
      const operation = Object.assign({}, $event);
      this.editedRow['IdOperationNavigation'] = operation;
      if (!this.isForRepairOrder) {
        this.editedRow['Ttcprice'] = operation.Ttcprice;
        this.gridFormGroup.controls.Ttcprice.setValue(operation.Ttcprice);
      } else {
        this.editedRow['Htprice'] = operation.Htprice;
        this.gridFormGroup.controls.Htprice.setValue(operation.Htprice);
      }
      this.gridFormGroup.controls.IdOperationNavigation.setValue(operation);
      this.gridFormGroup.controls.Duration.setValue(operation.ExpectedDuration);
    } else {
      this.editedRow = {};
      this.editedRow.IdOperationNavigation = undefined;
      this.gridFormGroup.controls.IdOperationNavigation.setValue(undefined);
      this.gridFormGroup.controls.Duration.setValue(undefined);
      if (!this.isForRepairOrder) {
        this.gridFormGroup.controls.Ttcprice.setValue(undefined);
      } else {
        this.gridFormGroup.controls.Htprice.setValue(undefined);
      }
    }
  }

  getDurationAsString(operation): string {
    let duration = '';
    if (operation.DurationInDays > 0) {
      duration = operation.DurationInDays.toString().concat(SPACE).concat(this.translateService.instant('DAYS')).concat(SPACE);
    }
    if (operation.DurationInHours > 0) {
      duration = duration.concat(operation.DurationInHours).concat(SPACE).concat(this.translateService.instant('HOURS')).concat(SPACE);
    }
    if (operation.DurationInMinutes > 0) {
      duration = duration.concat(operation.DurationInMinutes).concat(SPACE).concat(this.translateService.instant('MINUTES')).concat(SPACE);
    }
    if (operation.DurationInSecondes > 0) {
      duration = duration.concat(operation.DurationInSecondes).concat(SPACE).concat(this.translateService.instant('SECONDS')).concat(SPACE);
    }
    return duration;
  }

  public removeHandler({ dataItem, rowIndex }) {
    this.operationsChanged.emit(true);
    if (!this.isEditingMode) {
      this.swalWarrings.CreateSwal().then((result: { value: any; }) => {
        if (result.value) {
          if (!this.isForRepairOrder) {
            const index = this.interventionOperationsList.findIndex((x) => x.IdOperation === dataItem.IdOperation);
            this.interventionOperationsList.splice(index, NumberConstant.ONE);
            const indexFromOperationIdsToIgnore = this.operationListIdsToIgnore.findIndex((x) => x === dataItem.IdOperation);
            this.operationListIdsToIgnore.splice(indexFromOperationIdsToIgnore, NumberConstant.ONE);
            this.gridSettings.state.skip = (this.interventionOperationsList.length % this.gridSettings.state.take) !== 0 ?
              this.gridSettings.state.skip : this.gridSettings.state.skip - this.gridSettings.state.take;
            this.gridSettings.state.skip = (this.gridSettings.state.skip < 0) ? 0 : this.gridSettings.state.skip;
          }
          else {
            const index = this.repairOrderOperationsList.findIndex((x) => x.IdOperation === dataItem.IdOperation);
            this.repairOrderOperationsList.splice(index, NumberConstant.ONE);
            const indexFromOperationIdsToIgnore = this.operationListIdsToIgnore.findIndex((x) => x === dataItem.IdOperation);
            this.operationListIdsToIgnore.splice(indexFromOperationIdsToIgnore, NumberConstant.ONE);
            this.gridSettings.state.skip = (this.repairOrderOperationsList.length % this.gridSettings.state.take) !== 0 ?
              this.gridSettings.state.skip : this.gridSettings.state.skip - this.gridSettings.state.take;
            this.gridSettings.state.skip = (this.gridSettings.state.skip < 0) ? 0 : this.gridSettings.state.skip;
          }
          this.processGridData();
        }
      });
    }
  }
}
