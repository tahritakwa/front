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
import { GridBeComponent } from '../grid-be/grid-be.component';
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

const BE = 'BE';

@Component({
  selector: 'app-be-add',
  templateUrl: './be-add.component.html',
  styleUrls: ['./be-add.component.scss']
})
export class BeAddComponent extends DocumentAddComponent implements OnInit, OnDestroy {
  @ViewChild(ContactDropdownComponent) public childListContactDropDown;
  @ViewChild(GridBeComponent) public documentLineGrid;
  @ViewChild('tiersDropDown') tiersDropDownEl: SupplierDropdownComponent;
  documentTitle: string;
  currentDate = new Date();
  documentType = DocumentEnumerator.BE;
  @ViewChild(SupplierDropdownComponent) public tiersDropDown;
  public isNewBe: boolean;

  ngOnDestroy(): void {
    this.destroy();
  }
  public printDocumentPermission = false;
  public validateDocumentPermission = false;
  public showSupplierDetails = false;
  public hideSupplierAddBtn = false;
  public hasUpdatePermission = false;
  public hasAddPermission = false;
  public isUpdateMode = false;

  constructor(
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
    private fb: FormBuilder,
    protected permissionsService: StarkPermissionsService,
    protected searchItemService: SearchItemService,
    protected fileServiceService: FileService, protected rolesService: StarkRolesService,
    protected growlService: GrowlService,
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
      service, serviceReportTemplate, languageService, permissionsService, searchItemService, fileServiceService, rolesService,
      growlService, tiersService);

    this.route.params.subscribe(params => {
      const idDocument = +params[DocumentConstant.ID];
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
    this.isSalesDocumment = false;
  }

  changeMotif() {
    this.prepareDocumentToUpdate();
    if (this.updateDocumentCondition()) {
      const objectToSave = new ObjectToSend(this.document);
      this.documentService.updateDocumentFields(objectToSave).subscribe();
    }
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
      Code: [{ value: this.translate.instant(BE) + '/' + this.currentDate.getFullYear(), disabled: true }],
      IdCurrency: [{ value: '', disabled: true }, Validators.required],
      IdContact: [{ value: '', disabled: this.isDisabledForm() }],
      DocumentHtpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTtcpriceWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTtcprice: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalDiscountWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentTotalExcVatTaxesWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentPriceIncludeVatWithCurrency: [{ value: NumberConstant.ZERO, disabled: true }],
      DocumentAmountPaidWithCurrency: [0],
      DocumentRemainingAmountWithCurrency: [0],
      DocumentTypeCode: [this.documentEnumerator.BE],
      IdDocumentAssociated: [null],
      IdDocumentAssociatedStatus: [1],
      DocumentAssociatedType: [this.documentEnumerator.BE],
      IsGenerated: [false],
      Reference: [{ value: '', disabled: this.isDisabledForm() }],
      ProvisionalCode: ['']
    });
  }


  ngOnInit() {
    this.printDocumentPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_ADMISSION_VOUCHERS);
    this.validateDocumentPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.VALIDATE_ADMISSION_VOUCHERS);
    this.showSupplierDetails = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER);
    this.hideSupplierAddBtn = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SUPPLIER);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_ADMISSION_VOUCHERS);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_ADMISSION_VOUCHERS);
    super.ngOnInit();
    this.createAddForm();
    this.getListReportTemplate();
    if (this.id > 0) {
      this.getDataToUpdate();
    }
    this.documentTitle = this.translate.instant(BE);
    this.documentService.setDocumentType(this.documentType);
    this.warningParagraph = 'VALIDATE_BE_WARRINIG_PARAGRAPH';
    this.validateDocumentText = 'VALIDATE_BE';
    this.validationMessageServiceInformation = InformationTypeEnum.BE_VALIDATION;
    this.addMessageServiceInformation = InformationTypeEnum.BE_ADD;
    this.backToListLink = StockCorrectionConstant.BE_URL_LIST;
    this.routerReportLink = StockCorrectionConstant.BE_REPORT_URL;
    this.loadUpdateValidDocumentRole();
    if (this.isUpdateMode && !this.hasUpdatePermission
      && this.documentForm.controls['IdDocumentStatus'].value === this.statusCode.Provisional) {
      this.documentForm.disable();
    }
  }

  /**
   * focusOnAddLine
   */
  public focusOnAddLine() {
    this.documentLineGrid.focusOnAddLineButton();
  }

  public loadPrintDocumentRole() {
    if (this.documentType === DocumentEnumerator.BE) {
      this.permissionsService.hasPermission(RoleConfigConstant.PRINT.BE).then(x => this.printDocumentRole = x);
    }
  }

  public loadUpdateValidDocumentRole() {
    if (this.documentType === DocumentEnumerator.BE) {
      this.updateValidDocumentRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_VALID_ADMISSION_VOUCHERS);
    }
  }

  public loadDeleteValidDocumentRole() {

    if (this.documentType === DocumentEnumerator.BE) {
      this.permissionsService.hasPermission(RoleConfigConstant.DELETE.BE_SA).then(x => this.deleteDocumentLineRole = x);
    }
  }

  get Code(): FormControl {
    return this.documentForm.get(DocumentConstant.CODE) as FormControl;
  }

}
