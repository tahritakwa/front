import { Component, OnInit, Input, ViewChild, EventEmitter, Output, OnDestroy, ViewContainerRef } from '@angular/core';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { ObjectToSave, ObjectToSend } from '../../../models/sales/object-to-save.model';
import { DocumentService } from '../../../sales/services/document/document.service';
import { Document } from '../../../models/sales/document.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentAddComponent } from '../../../shared/components/document/document-add/document-add.component';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { TranslateService } from '@ngx-translate/core';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { CrudGridService } from '../../../sales/services/document-line/crud-grid.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { MessageService } from '../../../shared/services/signalr/message/message.service';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import {
  GridPurchaseInvoiceAssestsBudgetComponent
} from '../../components/grid-purchase-invoice-assests-budget/grid-purchase-invoice-assests-budget.component';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DocumentLine } from '../../../models/sales/document-line.model';
import { ReportTemplateService } from '../../../shared/services/report-template/report-template.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';

import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { FileService } from '../../../shared/services/file/file-service.service';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TiersService } from '../../services/tiers/tiers.service';
const MIN_DATE_FILTER = 1753;
@Component({
  selector: 'app-add-devis',
  templateUrl: './add-devis.component.html',
  styleUrls: ['./add-devis.component.scss']
})
export class AddDevisComponent extends DocumentAddComponent implements OnInit, OnDestroy {
  @Input() public documentForm: FormGroup;

  @ViewChild(GridPurchaseInvoiceAssestsBudgetComponent) public documentLineGrid;
  id: number;
  isUpdateMode: boolean;
  objectToSend: ObjectToSave;
  idDocument: number;
  Code: string;
  document: Document;
  /**purchaseOrder Form group */
  budgetForm: FormGroup;
  currentDocument: Document;
  documentType = DocumentEnumerator.PurchaseBudget;
  statusOfCurrentDocument: number;
  currentDate = new Date();
  @Output() saveDocumentLineQuotation: EventEmitter<any> = new EventEmitter<any>();
  @Output() isDeleteQuotation: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadGridQuotationAndPurchaseOrder: EventEmitter<any> = new EventEmitter<any>();
  @Input() formatOptionBudget;
  @Output() reloadDataAfterReplaceEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() isDisabled;
  hasDeletePermission = false;

  constructor(private fb: FormBuilder,
    protected currencyService: CurrencyService,
    protected documentFormService: DocumentFormService,
    protected translate: TranslateService,
    protected swalWarrings: SwalWarring,
    public documentService: DocumentService,
    protected validationService: ValidationService,
    protected messageService: MessageService,
    protected router: Router,
    private route: ActivatedRoute,
    protected service: CrudGridService,
    protected formModalDialogService: FormModalDialogService,
    protected viewRef: ViewContainerRef,
    protected serviceReportTemplate: ReportTemplateService,
    protected languageService: LanguageService,
    protected permissionsService: StarkPermissionsService,
    protected searchItemService: SearchItemService,
    protected fileServiceService: FileService,
    protected rolesService: StarkRolesService, protected growlService: GrowlService, private authService: AuthService,
    protected tiersService: TiersService) {
    super(currencyService,
      documentFormService,
      translate,
      swalWarrings,
      documentService,
      validationService,
      messageService,
      router,
      formModalDialogService,
      viewRef,
      service, serviceReportTemplate, languageService, permissionsService,
      searchItemService, fileServiceService, rolesService, growlService, tiersService);
    this.isSalesDocumment = false;
  }
  /**calls when the component is initilized */
  ngOnInit() {
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_ORDER_QUOTATION_PURCHASE);
    super.ngOnInit();
    this.idStatus = this.documentForm.controls['IdDocumentStatus'].value;
    this.createAddForm();
    this.getDataToUpdate();
  }
  /** create the form group */
  public createAddForm(): void {
    this.budgetForm = this.fb.group({
      Id: [0],
      IdTiers: [{ value: '', disabled: this.isDisabledForm() }, Validators.required],
      DocumentDate: [{
        value: new Date(this.documentForm.controls['DocumentDate'].value),
        disabled: this.isDisabledForm()
      }, Validators.required],
      IdDocumentStatus: [this.documentForm.controls['IdDocumentStatus'].value],
      Code: [{ value: 'DEVIS/' + this.currentDate.getFullYear(), disabled: true }],
      IdCurrency: [{ value: '', disabled: true }, Validators.required],
      IdContact: [{ value: '', disabled: this.isDisabledForm() }],
      DocumentHtpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTtcpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalDiscountWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentOtherTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: this.isDisabledForm() }],
      DocumentTotalExcVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentPriceIncludeVatWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentAmountPaidWithCurrency: [0],
      DocumentRemainingAmountWithCurrency: [0],
      DocumentTypeCode: [this.documentEnumerator.PurchaseBudget],
      IdDocumentAssociated: [null]
    });
  }
  public getDataToUpdate() {
    if (this.documentForm.controls['IdDocumentAssociated'].value > 0) {
      this.documentService.getDocumentWithDocumentLine(
        this.documentForm.controls['IdDocumentAssociated'].value).subscribe((data: Document) => {
          // Save the Received Document from the server
          this.currentDocument = new Document(data.DocumentLine, data);
          data.DocumentDate = new Date(data.DocumentDate);
          data.IdCurrency = data.IdUsedCurrency;
          this.statusOfCurrentDocument = data.IdDocumentStatus;
          this.budgetForm.patchValue(data);
          this.setDocumentLines();
          this.getSelectedCurrency();
          this.budgetForm.controls['IdDocumentStatus'].setValue(this.documentForm.controls['IdDocumentStatus'].value);
          this.idStatus = this.documentForm.controls['IdDocumentStatus'].value;
        });
    }
  }
  ngOnDestroy() {
    this.destroy();
  }
  saveBudget() {
    this.saveDocumentLineQuotation.emit();
  }
  changeData() {
    let isValidDates: boolean = true;
    if (this.budgetForm.get('DocumentDate') && this.budgetForm.get('DocumentDate').value) {
      let dateDoc = this.budgetForm.get('DocumentDate').value;
      if (dateDoc.getFullYear() < MIN_DATE_FILTER) {
        isValidDates = false;
        this.growlService.warningNotification(this.translate.instant('DOCUMENT_ACCOUNT_DATE_INVALID'));
      } else {
        this.budgetForm.get('DocumentDate').setValue(new Date(Date.UTC(dateDoc.getFullYear(), dateDoc.getMonth(), dateDoc.getDate())));
      }
    }
    if (isValidDates) {
      this.prepareDocumentToUpdate();
      if (this.updateDocumentCondition()) {
        let budgetDoc: Document = this.budgetForm.getRawValue();
        budgetDoc.IdUsedCurrency = this.budgetForm.controls['IdCurrency'].value;
        const objectToSave = new ObjectToSend(budgetDoc);
        this.documentService.updateDocumentFields(objectToSave).subscribe((data: any) => {
          var doct = data.objectData;
          // Save the Received Document from the server
          this.currentDocument = new Document(doct.DocumentLine, doct);
          doct.DocumentDate = new Date(doct.DocumentDate);
          doct.IdCurrency = doct.IdUsedCurrency;
          this.statusOfCurrentDocument = doct.IdDocumentStatus;
          this.budgetForm.patchValue(doct);
          this.getSelectedCurrency();
          this.budgetForm.controls['IdDocumentStatus'].setValue(this.documentForm.controls['IdDocumentStatus'].value);
          this.idStatus = this.documentForm.controls['IdDocumentStatus'].value;
        });
      }
    }
  }
  deleteQuotation() {
    this.documentService.deleteDocument(this.budgetForm.controls['Id'].value).subscribe((data: any) => {
      this.isDeleteQuotation.emit();
    });
  }
  loadDocumentLines() {
    this.documentLineGrid.loadItems();
    this.loadGridQuotationAndPurchaseOrder.emit();
  }

  public loadPrintDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchasesQuotations) {
      this.permissionsService.hasPermission(RoleConfigConstant.PRINT.PURCHASEQUOTATION).then(x => this.printDocumentRole = x);
    }
  }
  public loadUpdateValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchasesQuotations) {
      this.permissionsService.hasPermission(RoleConfigConstant.UPDATE.PURCHASEQUOTATION_SA).then(x => this.updateValidDocumentRole = x);
    }
  }

  public loadDeleteValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.PurchasesQuotations) {
      this.permissionsService.hasPermission(RoleConfigConstant.DELETE.PURCHASEQUOTATION_SA).then(x => this.deleteDocumentLineRole = x);
    }
  }
  reloadDataAfterReplace(){
    this.reloadDataAfterReplaceEvent.emit();
  }
}
