import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { DocumentAddComponent } from '../../../shared/components/document/document-add/document-add.component';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { DocumentFormService } from '../../../shared/services/document/document-grid.service';
import { MessageService } from '../../../shared/services/signalr/message/message.service';
import { ReportTemplateService } from '../../../shared/services/report-template/report-template.service';
import { DocumentService } from '../../../sales/services/document/document.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { CrudGridService } from '../../../sales/services/document-line/crud-grid.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { ContactDropdownComponent } from '../../../shared/components/contact-dropdown/contact-dropdown.component';
import { FileInfo } from '../../../models/shared/objectToSend';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { StockCorrectionConstant } from '../../../constant/stock-correction/stock-correction.constant';
import { GridBsComponent } from '../grid-bs/grid-bs.component';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { StarkPermissionsService, StarkRolesService } from '../../../stark-permissions/stark-permissions.module';
import { FileService } from '../../../shared/services/file/file-service.service';
import { SupplierDropdownComponent } from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { TiersService } from '../../../purchase/services/tiers/tiers.service';

const BS = 'BS';
@Component({
  selector: 'app-bs-add',
  templateUrl: './bs-add.component.html',
  styleUrls: ['./bs-add.component.scss']
})
export class BsAddComponent extends DocumentAddComponent implements OnInit, OnDestroy {
  @ViewChild('tiersDropDown') tiersDropDownEl: SupplierDropdownComponent;
  // contact dropdown
  @ViewChild(ContactDropdownComponent) public childListContactDropDown;
  @ViewChild(GridBsComponent) public documentLineGrid;
  /** document Title Asset */
  documentTitle: string;

  /** action to Do (Add, edit, show ) */
  type: string;

  /** document Type */
  documentType = DocumentEnumerator.BS;
  currentDate = new Date();
  public printDocumentPermission = false;
  public validateDocumentPermission = false;
  public showCustomerDetails = false;
  public hideCustomerAddBtn = false;
  public hasUpdatePermission = false;
  public hasAddPermission = false;
  public isUpdateMode = false;

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
    protected serviceReportTemplate: ReportTemplateService, protected languageService: LanguageService,
    protected permissionsService: StarkPermissionsService, protected searchItemService: SearchItemService,
    protected fileServiceService: FileService, protected rolesService: StarkRolesService, protected growlService: GrowlService,
    public authService: AuthService, protected tiersService: TiersService) {
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
      service, serviceReportTemplate, languageService,
      permissionsService,
      searchItemService,
      fileServiceService, rolesService, growlService, tiersService);
    this.route.params.subscribe(params => {
      const idDocument = +params[DocumentConstant.ID]; // (+) converts string InvoiceConstants.ID to a number
      const idStatusParam = +params[DocumentConstant.STATUS_PARAM];
      if (idDocument) {
        this.id = idDocument;
        this.isUpdateMode = true;
      }
      if (idStatusParam) {
        this.idStatus = idStatusParam;
      }
    });
    this.attachmentFilesToUpload = new Array<FileInfo>();
    this.isSalesDocumment = true;
  }

  CallngOnInit() {
    this.ngOnInit.bind(this);
  }

  /** create the form group */
  public createAddForm(): void {
    this.documentForm = this.fb.group({
      Id: [0],
      IdTiers: [{ value: '', disabled: this.isDisabledForm() }, Validators.required],
      DocumentDate: [{ value: new Date(), disabled: this.isDisabledForm() }, Validators.required],
      IdDocumentStatus: [1],
      Code: [{ value: this.translate.instant(BS) + '/' + this.currentDate.getFullYear(), disabled: true }],
      Reference: [{ value: '', disabled: this.isDisabledForm() }],
      IdCurrency: [{ value: '', disabled: true }, Validators.required],
      IdContact: [{ value: '', disabled: this.isDisabledForm() }],
      DocumentHtpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTtcpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTtcprice: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalDiscountWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentOtherTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: this.isDisabledForm() }],
      DocumentTotalExcVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentPriceIncludeVatWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentAmountPaidWithCurrency: [0],
      DocumentRemainingAmountWithCurrency: [0],
      DocumentTypeCode: [this.documentEnumerator.BS],
      IdDocumentAssociated: [null],
      ProvisionalCode: ['']
    });
  }
  ngOnInit() {
    this.printDocumentPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_EXIT_VOUCHERS);
    this.validateDocumentPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.VALIDATE_EXIT_VOUCHERS);
    this.showCustomerDetails = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);
    this.hideCustomerAddBtn = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_CUSTOMER);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_EXIT_VOUCHERS);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_EXIT_VOUCHERS);
    super.ngOnInit();
    this.type = this.documentService.setDocumentUrlType(this.router);
    this.documentLineGrid.view = this.service.linesToDisplay('data');
    this.createAddForm();
    this.getListReportTemplate();
    if (this.id > 0) {
      this.getDataToUpdate();
    }
    this.documentTitle = this.translate.instant(BS);
    this.documentService.setDocumentType(this.documentType);
    this.warningParagraph = 'VALIDATE_BS_WARRINIG_PARAGRAPH';
    this.validateDocumentText = 'VALIDATE_BS';
    this.addMessageServiceInformation = InformationTypeEnum.BS_ADD;
    this.addMessageServiceInformation = InformationTypeEnum.BS_ADD;
    this.backToListLink = StockCorrectionConstant.BS_URL_LIST;
    this.routerReportLink = StockCorrectionConstant.BS_REPORT_URL;
    super.ngOnInit();
    if (this.isUpdateMode && !this.hasUpdatePermission
      && this.documentForm.controls['IdDocumentStatus'].value === this.statusCode.Provisional) {
      this.documentForm.disable();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }
  setDocumentLines() {
    this.documentLineGrid.loadItems();
  }

  changeMotif() {
    this.prepareDocumentToUpdate();
    if (this.updateDocumentCondition()) {
      const objectToSave = new ObjectToSend(this.document);
      this.documentService.updateDocumentFields(objectToSave).subscribe();
    }
  }
  /**
   * focusOnAddLine
   */
  public focusOnAddLine() {
    this.documentLineGrid.focusOnAddLineButton();
  }
  // public setSupplierName() {
  //   this.searchItemService.supplierName = this.tiersDropDownEl.IdTiersEl.dataItem.Name;
  // }

  public loadPrintDocumentRole() {
    if (this.documentType === DocumentEnumerator.BS) {
      this.permissionsService.hasPermission(RoleConfigConstant.PRINT.BS).then(x => this.printDocumentRole = x);
    }
  }
  public loadUpdateValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.BS) {
      this.updateValidDocumentRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_VALID_EXIT_VOUCHERS);
    }
  }

  public loadDeleteValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.BS) {
      this.permissionsService.hasPermission(RoleConfigConstant.DELETE.BS_SA).then(x => this.deleteDocumentLineRole = x);
    }
  }

  get Code(): FormControl {
    return this.documentForm.get(DocumentConstant.CODE) as FormControl;
  }

}
