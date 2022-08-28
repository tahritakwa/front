import { Component, OnInit, Input, ViewChild, EventEmitter, Output} from '@angular/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { NumberConstant } from '../../../constant/utility/number.constant';


@Component({
  selector: 'app-grid-machine',
  templateUrl: './grid-machine.component.html',
  styleUrls: ['./grid-machine.component.scss']
})
export class GridMachineComponent implements OnInit {
  @Input() machineSelected;
  @Input() data: any[];
  @Input() hasUpdatePermission : boolean;
  @ViewChild(GridComponent) private grid: GridComponent;
  @Input() idGarage = 0;
  @Output() machineAdded = new EventEmitter<any>();
  @Output() machineRemoved = new EventEmitter<any>();


  private editedRowIndex: number;
  formGroup: FormGroup;
  isEditingMode = false;
  selectedMachine: any;
  isRemoved = false;

  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.NAME,
      title: GarageConstant.MACHINE_NAME_TITLE,
      filterable: true,
    },
    {
      field: GarageConstant.CONSTRUCTOR,
      title: GarageConstant.CONSTRUCTOR_TITLE,
      filterable: true,
    },
    {
      field: GarageConstant.MODEL,
      title: GarageConstant.MODEL_TITLE,
      filterable: true,
    },
    {
      field: GarageConstant.STATE,
      title: GarageConstant.STATE_TITLE,
      filterable: true,
    }
  ];
  constructor(private fb: FormBuilder, private validationService: ValidationService) {
  }

  ngOnInit() {
  }
  createFormGroup(dataItem?) {
    this.formGroup = this.fb.group({
      Id: [dataItem ? dataItem.Id : undefined, Validators.required],
      Name: [dataItem ? dataItem.Name : ''],
      Constructor: [{ value: dataItem ? dataItem.Constructor : '', disabled: true }],
      Model: [{ value: dataItem ? dataItem.Model : '', disabled: true }],
      State: [{ value: dataItem ? dataItem.State : '', disabled: true }],
    });
  }

  addLine() {
    this.createFormGroup();
    this.grid.addRow(this.formGroup);
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
      this.selectedMachine = dataItem;
      this.createFormGroup(dataItem);
      this.grid.editRow(rowIndex, this.formGroup);
    }
  }

  saveCurrent() {
    if (this.formGroup.valid) {
      const machine = this.selectedMachine;
      const index = this.data.findIndex(x => x.Id === machine.Id);
      if (index < 0) {
        this.data.unshift(machine);
        this.machineAdded.emit(machine);
      }
      this.closeEditor();
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }
  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.isEditingMode = false;
  }

  removeLine(event) {
    const index = this.data.findIndex(x => x.Id === event.dataItem.Id);
    this.machineRemoved.emit(event.dataItem);
    this.data.splice(index, NumberConstant.ONE);
    this.editedRowIndex = event.rowIndex;
    this.closeEditor();
    this.isRemoved = true;
  }

  public cancelHandler(): void {
    this.closeEditor();
  }

  onSelectMachine($event) {
    if ($event) {
      this.selectedMachine = Object.assign({}, $event);
      this.formGroup.patchValue(this.selectedMachine);
    } else {
      this.formGroup.reset();
    }
  }
}
