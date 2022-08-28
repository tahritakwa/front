import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridComponent } from '@progress/kendo-angular-grid';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
const ID = 'Id';
@Component({
  selector: 'app-grid-worker',
  templateUrl: './grid-worker.component.html',
  styleUrls: ['./grid-worker.component.scss']
})
export class GridWorkerComponent implements OnInit {
  @Input() idGarage: number = null;
  @Input() data: any[];
  @Input() hasUpdatePermission: boolean;
  @ViewChild(GridComponent) private grid: GridComponent;

  private editedRowIndex: number;
  garageFormGroup: FormGroup;
  isEditingMode = false;
  selectedWorker: any;
  isRemoved = false;

  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.FULL_NAME,
      title: GarageConstant.WORKER_TITLE,
      filterable: true,
    },
    {
      field: GarageConstant.ADDRESS,
      title: GarageConstant.ADDRESS.toUpperCase(),
      filterable: true,
    },
    {
      field: GarageConstant.PHONE_NUMBER,
      title: GarageConstant.PHONE_TITLE,
      filterable: true,
    },
    {
      field: GarageConstant.EMAIL_WORKER,
      title: GarageConstant.EMAIL,
      filterable: true,
    }
  ];
  constructor(private fb: FormBuilder, private validationService: ValidationService) { }
  ngOnInit() {
  }

  createFormGroup(dataItem?) {
    this.garageFormGroup = this.fb.group({
      Id: [dataItem ? dataItem.Id : undefined, Validators.required],
      FirstName: [dataItem ? dataItem.FirstName : ''],
      LastName: [dataItem ? dataItem.LastName : ''],
      PhoneNumber: [{ value: dataItem ? dataItem.PhoneNumber : '', disabled: true }],
      Address: [{ value: dataItem ? dataItem.Address : '', disabled: true }],
      Email: [{ value: dataItem ? dataItem.Email : '', disabled: true }],
      IdGarage: [{ value: this.idGarage ? this.idGarage : null }],
    });
  }
  addLine() {
    this.createFormGroup();
    this.grid.addRow(this.garageFormGroup);
    this.isEditingMode = true;
  }

  lineClickHandler({ isEdited, dataItem, rowIndex }, SetedValue?: boolean, data?: any): void {
    if (!this.isEditingMode && this.hasUpdatePermission) {
      if (this.isRemoved) {
        this.isRemoved = false;
        return;
      }
      this.isEditingMode = true;
      this.editedRowIndex = rowIndex;
      this.selectedWorker = dataItem;
      this.createFormGroup(dataItem);
      this.grid.editRow(rowIndex, this.garageFormGroup);
    }
  }


  validateForm() {
    if (!this.garageFormGroup.valid) {
      this.validationService.validateAllFormFields(this.garageFormGroup);
    }
  }
  onSelectWorker($event) {
    if ($event) {
      this.selectedWorker = Object.assign({}, $event);
      this.garageFormGroup.patchValue(this.selectedWorker);
    } else {
      this.garageFormGroup.reset();
    }
  }
  saveCurrent() {
    if (this.garageFormGroup.valid) {
      const worker = this.selectedWorker;
      const index = this.data.findIndex(x => x.Id === worker.Id);
      if (index < 0) {
        this.data.unshift(worker);
      }
      this.closeEditor();
    } else {
      this.validationService.validateAllFormFields(this.garageFormGroup);
    }
  }

  removeLine(event) {
    const index = this.data.findIndex(x => x.Id === event.dataItem.Id);
    this.data.splice(index, NumberConstant.ONE);
    this.editedRowIndex = event.rowIndex;
    this.closeEditor();
    // used to close nextline
    this.isRemoved = true;
  }
  cancelHandler() {
    this.closeEditor();
  }
  closeEditor() {
    this.grid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.garageFormGroup = undefined;
    this.isEditingMode = false;
  }
}
