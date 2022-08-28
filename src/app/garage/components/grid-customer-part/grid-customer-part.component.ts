import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridComponent } from '@progress/kendo-angular-grid';
import { CompanyService } from '../../../administration/services/company/company.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Currency } from '../../../models/administration/currency.model';
import { InterventionOrderStateEnumerator } from '../../../models/enumerators/intervention-order-state.enum';
import { CustomerParts } from '../../../models/garage/customer-parts.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { LanguageService } from '../../../shared/services/language/language.service';
import { strictSup, ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-grid-customer-part',
  templateUrl: './grid-customer-part.component.html',
  styleUrls: ['./grid-customer-part.component.scss']
})
export class GridCustomerPartComponent implements OnInit {
  @Input() idIntervention: number;
  @Input() intervention: any;
  @Input() customerPartsList: CustomerParts[];
  @Input() hasUpdatePermission: boolean;
  @Output() customerPartsChanged: EventEmitter<any> = new EventEmitter();
  @ViewChild('grid') grid: GridComponent;
  language: string;
  userCurrency: Currency;
  customerParts: CustomerParts;
  formGroup: FormGroup;
  interventionStateEnumerator = InterventionOrderStateEnumerator;
  private editedRowIndex: number;
  isEditingMode = false;
  filterValue = '';

  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.REFERENCE,
      title: GarageConstant.REFERENCE_TITLE,
      filterable: true,
      tooltip: GarageConstant.REFERENCE_TITLE
    },
    {
      field: GarageConstant.DESIGNATION,
      title: GarageConstant.DESIGNATION_TITLE,
      filterable: true,
      tooltip: GarageConstant.DESIGNATION_TITLE
    },
    {
      field: GarageConstant.QUANTITY,
      title: GarageConstant.QUANTITY_TITLE,
      filterable: true,
      tooltip: GarageConstant.QUANTITY_TITLE
    }
  ];

  constructor(private fb: FormBuilder, private validationService: ValidationService, private swalWarrings: SwalWarring,
    private localStorageService : LocalStorageService, private companyService: CompanyService) {
      this.language = this.localStorageService.getLanguage();

  }

  ngOnInit() {
  }

  createFormGroup(dataItem?) {
    this.formGroup = this.fb.group({
      Id: [dataItem ? dataItem.Id : 0],
      IdIntervention: [dataItem ? dataItem.IdIntervention : this.idIntervention],
      Reference: [dataItem ? dataItem.Reference : undefined, Validators.required],
      Designation: [dataItem ? dataItem.Designation : undefined, Validators.required],
      Quantity: [dataItem ? dataItem.Quantity : NumberConstant.ONE, Validators.compose([
        Validators.pattern('^[0-9]+(\.[0-9]+)?$'), strictSup(0)
      ])]
    });
  }

  addHandler({ sender }) {
    if (!this.isEditingMode) {
      this.createFormGroup();
      this.grid.addRow(this.formGroup);
      this.isEditingMode = true;
    }
  }

  editHandler({ dataItem, rowIndex }) {
    if (!this.isEditingMode && this.hasUpdatePermission) {
      this.isEditingMode = true;
      this.editedRowIndex = rowIndex;
      this.customerParts = dataItem;
      this.createFormGroup(this.customerParts);
      this.grid.editRow(rowIndex, this.formGroup);
    }
  }

  saveHandler({ dataItem, formGroup, isNew, rowIndex, sender }) {
    if (this.formGroup.valid) {
      this.customerPartsChanged.emit(true);
      this.customerParts = Object.assign({}, this.customerParts, formGroup.getRawValue());
      if (isNew) {
        this.customerPartsList.unshift(this.customerParts);
      } else {
        this.customerPartsList[rowIndex] = this.customerParts;
      }
      this.closeEditor();
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  closeEditor() {
    this.grid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.isEditingMode = false;
  }

  cancelHandler({ isNew }) {
    this.closeEditor();
  }

  public removeHandler({ dataItem, rowIndex }) {
    this.customerPartsChanged.emit(true);
    if (!this.isEditingMode) {
      this.swalWarrings.CreateSwal().then((result: { value: any; }) => {
        if (result.value) {
          this.customerPartsList.splice(rowIndex, NumberConstant.ONE);
        }
      });
    }
  }

  getCustomerParts(): any[] {
    return this.customerPartsList;
  }
}
