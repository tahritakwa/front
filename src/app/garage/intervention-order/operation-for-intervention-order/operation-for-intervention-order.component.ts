import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { CompanyService } from '../../../administration/services/company/company.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { StyleConstant } from '../../../constant/utility/style.constant';
import { Company } from '../../../models/administration/company.model';
import { Currency } from '../../../models/administration/currency.model';
import { InterventionOrderTypeEnumerator } from '../../../models/enumerators/intervention-order-type.enum';
import { OperationStatusEnumerator } from '../../../models/enumerators/operation-status.enum';
import { OperationValidateByEnumerator } from '../../../models/enumerators/operation-validate-by.enum';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { strictSup, ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';

import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { GridCustomerPartComponent } from '../../components/grid-customer-part/grid-customer-part.component';
import { OperationToBePerformedComponent } from '../../components/operation-to-be-performed/operation-to-be-performed.component';
import { SparePartForInterventionComponent } from '../../components/spare-part-for-intervention/spare-part-for-intervention.component';
import { OperationService } from '../../services/operation/operation.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
const SPACE = ' ';

@Component({
  selector: 'app-operation-for-intervention-order',
  templateUrl: './operation-for-intervention-order.component.html',
  styleUrls: ['./operation-for-intervention-order.component.scss']
})
export class OperationForInterventionOrderComponent implements OnInit {
  @Input() idMileageProgrammed: number;
  @Input() idIntervention: number;
  @Input() selectedMileage: string;
  @Input() idWarehouse: string;
  @Input() idGarage: number;
  @Input() isProposedOperationGridVisible: boolean;
  @Input() form: FormGroup;
  @Input() receptionForm: FormGroup;
  @Input() interventionOperationsList: any[];
  @Input() interventionItemList: any[];
  @Input() customerPartsList: any[];
  @Input() operationListIdsToIgnore: any[];
  @Input() isUpdateMode: boolean;
  @Input() isInterventionCompleted: boolean;
  @Input() interventionOrder: any;
  @Input() hasUpdatePermission: boolean;
  @ViewChild('grid') grid: GridComponent;
  @ViewChild('sparePartViewChild') sparePartViewChild: SparePartForInterventionComponent;
  @ViewChild('customerPartsViewChild') customerPartsViewChild: GridCustomerPartComponent;
  @ViewChild('operationToBePerformedChild') operationToBePerformedChild: OperationToBePerformedComponent;
  @Output() updateInterventionItem: EventEmitter<any> = new EventEmitter();
  @Output() operationsChanged: EventEmitter<any> = new EventEmitter();
  gridFormGroup: FormGroup;
  isEditingMode = false;
  formatDate = this.translateService.instant(SharedConstant.DATE_FORMAT);
  language: string;
  companyCurrency: Currency;
  operationValidateByEnumerator = OperationValidateByEnumerator;
  operationStatusEnumerator = OperationStatusEnumerator;
  interventionTypeEnumerator = InterventionOrderTypeEnumerator;
  public setBorderStyleForProposedOperation: string;
  public setBorderStyleForOperationToBePerformed: string;
  public setBorderStyleForNecessaryParts: string;
  public fieldsetBorderShowed = StyleConstant.BORDER_SOLID;
  public fieldsetBorderHidden = StyleConstant.BORDER_NONE;
  public isProposedOperationContentVisible = true;
  public isOperationToBePerformedContentVisible = true;
  public isNecessaryPartContentVisible = true;

  constructor( private companyService: CompanyService,
     public viewRef: ViewContainerRef,
    private translateService: TranslateService, public operationService: OperationService,

      private fb: FormBuilder, private validationService: ValidationService, private growlService: GrowlService, private localStorageService : LocalStorageService) {
    this.setBorderStyleForProposedOperation = this.fieldsetBorderShowed;
    this.setBorderStyleForOperationToBePerformed = this.fieldsetBorderShowed;
    this.setBorderStyleForNecessaryParts = this.fieldsetBorderShowed;
    this.language = this.localStorageService.getLanguage();
      }

  ngOnInit() {
    // company currency
    this.companyService.getCurrentCompany().subscribe((data: Company) => {
      this.companyCurrency = data.IdCurrencyNavigation;
    });
  }

  interventionDateChange($event) {
    this.receptionForm.controls.ReceiptDate.updateValueAndValidity();
    this.form.controls.ExpectedDeliveryDate.updateValueAndValidity();
  }

  expectedDeliveryDateChange($event) {
    this.form.controls.InterventionDate.updateValueAndValidity();
  }

  interventionHoursChange($event) {
    this.form.controls.InterventionDate.updateValueAndValidity();
  }

  expectedDeliveryHoursChange($event) {
    this.form.controls.ExpectedDeliveryDate.updateValueAndValidity();
  }

  getInterventionOperation(): any[] {
    return this.interventionOperationsList;
  }

  getInterventionItem(): any[] {
    return this.sparePartViewChild.getInterventionItem();
  }

  updateInterventionParts() {
    this.updateInterventionItem.emit();
  }

  getCustomerParts(): any[] {
    return this.customerPartsViewChild.getCustomerParts();
  }

  showProposedOperationContent() {
    this.isProposedOperationContentVisible = true;
    this.setBorderStyleForProposedOperation = this.fieldsetBorderShowed;
  }

  hideProposedOperationContent() {
    this.isProposedOperationContentVisible = false;
    this.setBorderStyleForProposedOperation = this.fieldsetBorderHidden;
  }

  showOperationToBePerformedContent() {
    this.isOperationToBePerformedContentVisible = true;
    this.setBorderStyleForOperationToBePerformed = this.fieldsetBorderShowed;
  }

  hideOperationToBePerformedContent() {
    this.isOperationToBePerformedContentVisible = false;
    this.setBorderStyleForOperationToBePerformed = this.fieldsetBorderHidden;
  }

  showNecessaryPartContent() {
    this.isNecessaryPartContentVisible = true;
    this.setBorderStyleForNecessaryParts = this.fieldsetBorderShowed;
  }

  hideNecessaryPartContent() {
    this.isNecessaryPartContentVisible = false;
    this.setBorderStyleForNecessaryParts = this.fieldsetBorderHidden;
  }

  operationAddedFromProposition($event) {
    if (this.operationToBePerformedChild) {
      this.operationToBePerformedChild.processGridData();
    }
    this.operationListIdsToIgnore.unshift($event);
  }

  operationsToBePerformedValueChanged($event) {
    this.operationsChanged.emit($event);
  }

  onSparePartsChanged($event) {
    this.operationsChanged.emit($event);
  }

  onCustomerPartsChanged($event) {
    this.operationsChanged.emit($event);
  }
}
