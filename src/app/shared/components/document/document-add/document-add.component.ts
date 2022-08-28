import { ViewContainerRef, OnInit } from '@angular/core';
import { GenericAddDocument } from '../document-generic-method/generic-document-add';
import { DocumentConstant } from '../../../../constant/sales/document.constant';
import { DocumentEnumerator, documentStatusCode } from '../../../../models/enumerators/document.enum';
import { CurrencyService } from '../../../../administration/services/currency/currency.service';
import { DocumentFormService } from '../../../services/document/document-grid.service';
import { TranslateService } from '@ngx-translate/core';
import { SwalWarring } from '../../swal/swal-popup';
import { DocumentService } from '../../../../sales/services/document/document.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { Router } from '@angular/router';
import { FormModalDialogService } from '../../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { FileInfo } from '../../../../models/shared/objectToSend';
import { MessageService } from '../../../services/signalr/message/message.service';
import { CrudGridService } from '../../../../sales/services/document-line/crud-grid.service';
import { Document } from '../../../../models/sales/document.model';
import { ReportTemplateService } from '../../../services/report-template/report-template.service';
import { LanguageService } from '../../../services/language/language.service';
import { SettlementConstant } from '../../../../constant/payment/settlement.constant';
import { SearchItemService } from '../../../../sales/services/search-item/search-item.service';
import { StarkPermissionsService, StarkRolesService } from '../../../../stark-permissions/stark-permissions.module';
import { FileService } from '../../../services/file/file-service.service';
import { GrowlService } from '../../../../../COM/Growl/growl.service';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { PopUpSettlementDisposalComponent } from '../../pop-up-settlement-disposal/pop-up-settlement-disposal.component';
import { isNullOrUndefined } from 'util';
import { ObjectToSend } from '../../../../models/sales/object-to-save.model';
import { TiersService } from '../../../../purchase/services/tiers/tiers.service';

const MIN_DATE_FILTER = 1753;

export class DocumentAddComponent extends GenericAddDocument implements OnInit {
  documentLineGrid;
  childListContactDropDown;
  documentType;
  tiersDropDownEl;
  document: Document;
  keyEnterEvent = false;
  constructor(protected currencyService: CurrencyService,
    protected documentFormService: DocumentFormService,
    protected translate: TranslateService,
    protected swalWarrings: SwalWarring,
    protected documentService: DocumentService,
    protected validationService: ValidationService,
    protected messageService: MessageService,
    protected router: Router,
    protected formModalDialogService: FormModalDialogService,
    protected viewRef: ViewContainerRef,
    protected service: CrudGridService,
    protected serviceReportTemplate: ReportTemplateService,
    protected languageService: LanguageService,
    protected permissionsService: StarkPermissionsService,
    protected searchItemService: SearchItemService,
    protected fileServiceService: FileService,
    protected rolesService: StarkRolesService, protected growlService: GrowlService,
    protected tiersService: TiersService) {
    super(currencyService,
      documentFormService, translate, swalWarrings, documentService,
      validationService, messageService, router, formModalDialogService,
      viewRef, serviceReportTemplate, languageService, permissionsService,
      searchItemService, fileServiceService,
      rolesService, tiersService);
    this.attachmentFilesToUpload = new Array<FileInfo>();
    this.isSalesDocumment = false;
  }

  isAllawedToValidate(): boolean {
    return this.documentLineGrid.view.length > 0;
  }

  initialiseContactDropdown() {
    if (this.childListContactDropDown) {
      this.childListContactDropDown.initialiseContactDropdown();
    }
  }

  SetContact() {
    if (!isNullOrUndefined(this.documentForm) && this.childListContactDropDown) {
      this.childListContactDropDown.SetContact(this.documentForm.controls[DocumentConstant.ID_TIER].value);
    }
  }

  showReportAfterValidation(): boolean {
    return this.documentType === DocumentEnumerator.SalesDelivery || this.documentType === DocumentEnumerator.SalesOrder;
  }
  showReportWithOnPrintClick(): boolean {
    return (this.documentType === DocumentEnumerator.SalesDelivery || this.documentType === DocumentEnumerator.SalesOrder) &&
      this.documentForm.controls['IdDocumentStatus'].value === this.statusCode.Provisional;
  }

  showJasperReportWithOnPrintClick(): boolean {
    return (this.documentType === DocumentEnumerator.SalesDelivery || this.documentType === DocumentEnumerator.SalesOrder) &&
      this.documentForm.controls['IdDocumentStatus'].value === this.statusCode.Provisional;
  }

  isGeneratedLine() {
    if(this.documentLineGrid){
    this.documentLineGrid.isDocumentGenerated = this.currentDocument.IsGenerated;
    }
  }

  setDocumentLines() {
    if(this.documentLineGrid){
      this.documentLineGrid.loadItems();
    }
  }

  setSupplierName() {
    this.searchItemService.supplierName = (this.tiersDropDownEl && this.tiersDropDownEl.IdTiersEl
       && this.tiersDropDownEl.IdTiersEl.dataItem) ? this.tiersDropDownEl.IdTiersEl.dataItem.Name : '';
  }

  showPrintBtn() {
    // this.id = this.documentForm.controls['Id'].value;
    // return ((this.id !== NumberConstant.ZERO) || !this.isDisabledForm());
  }
  isDisabledForm(): boolean {
    if (this.documentForm) {
      if (this.documentForm.controls['IdDocumentStatus'].value !== -1
        && this.documentForm.controls['IdDocumentStatus'].value !== this.statusCode.Provisional) {
        if (!this.updateValidDocumentRole) {
          if ((this.documentForm.controls['DocumentTypeCode'].value === DocumentEnumerator.SalesInvoices || this.documentForm.controls['DocumentTypeCode'].value === DocumentEnumerator.PurchaseInvoices)  && this.documentForm.controls['IdDocumentStatus'].value == this.statusCode.DRAFT  ) {
             this.documentForm.controls['IdContact'].disable();
            this.documentForm.controls['DocumentDate'].disable();
            this.documentForm.controls['IdSettlementMode'].disable();
          } else {
            this.documentForm.disable();
            if (this.documentForm.controls['DocumentTypeCode'].value === DocumentEnumerator.PurchaseOrder) {
              this.documentForm.controls['IdContact'].enable();
            }
          }
        }
        if (this.documentForm.controls['DocumentTypeCode'].value === DocumentEnumerator.SalesInvoices  && this.documentForm.controls['IdDocumentStatus'].value == this.statusCode.DRAFT  ) {
          this.documentForm.controls['IdContact'].disable();
         this.documentForm.controls['DocumentDate'].disable();
         this.documentForm.controls['IdSettlementMode'].disable();
         this.documentForm.controls['Reference'].enable();
         this.documentForm.controls['DocumentOtherTaxesWithCurrency'].enable();
       }
        else {
         this.documentForm.disable();
         if (this.documentForm.controls['DocumentTypeCode'].value === DocumentEnumerator.PurchaseOrder) {
           this.documentForm.controls['IdContact'].enable();
         }
         if (this.documentForm.controls['DocumentTypeCode'].value === DocumentEnumerator.SalesDelivery
          && this.documentForm.controls['IdDocumentStatus'].value === this.statusCode.Valid && !this.documentForm.controls['IsForPos'].value) {
          this.documentForm.controls['IdTiers'].enable();
        }
       }
      }
      if (this.isFromSearchItemInterfce) {
        return this.documentForm.controls['IdDocumentStatus'].value !== -1 &&
        this.documentForm.controls['IdDocumentStatus'].value !== this.statusCode.Provisional;
      }
      if(this.documentForm.controls['IsBToB']) {
        this.documentForm.controls['Reference'].enable();
        this.documentForm.controls['Reference'].clearValidators();
        return ((this.idStatus !== -1 && this.idStatus !== this.statusCode.Provisional &&  this.idStatus !== this.statusCode.DRAFT)); 
      }
    }
    return ((this.idStatus !== -1 && this.idStatus !== this.statusCode.Provisional));
  }

  isPrintDisabled(): boolean {
    if (this.documentForm) {
      if (this.documentForm.controls['IdDocumentStatus'].value !== -1
        && this.documentForm.controls['IdDocumentStatus'].value !== this.statusCode.Provisional) {
        if (!this.printDocumentRole) {
          this.documentForm.disable();
        }
      }
    }
    return this.idStatus !== -1 && this.idStatus !== this.statusCode.Valid && this.idStatus !== this.statusCode.Balanced;
  }

  selectedContact(event) {
    this.prepareDocumentToUpdate();
    if (this.updateDocumentCondition()) {
      const objectToSave = new ObjectToSend(this.document);
      this.documentService.updateDocumentFields(objectToSave).subscribe(x => {
        x.objectData.DocumentDate = new Date(x.objectData.DocumentDate);
        x.objectData.DocumentInvoicingDate = new Date(x.objectData.DocumentInvoicingDate);
        this.documentForm.patchValue(x.objectData);
      });
    }
  }


  changeData(initDataSource?: boolean) {
    let isValidDates = true;
    if (this.documentForm.get('DocumentDate') && this.documentForm.get('DocumentDate').value) {
      const dateDoc = this.documentForm.get('DocumentDate').value;
      if (dateDoc.getFullYear() < MIN_DATE_FILTER) {
        isValidDates = false;
        this.growlService.warningNotification(this.translate.instant('DOCUMENT_ACCOUNT_DATE_INVALID'));
      } else {
        this.documentForm.get('DocumentDate').setValue(new Date(Date.UTC(dateDoc.getFullYear(), dateDoc.getMonth(), dateDoc.getDate())));
      }
    }

    if (this.documentForm.get('DocumentInvoicingDate') && this.documentForm.get('DocumentInvoicingDate').value) {
      const dateDocInv = this.documentForm.get('DocumentInvoicingDate').value;
      if (dateDocInv.getFullYear() < MIN_DATE_FILTER) {
        isValidDates = false;
        this.growlService.warningNotification(this.translate.instant('DATEINVOICING_DATE') + ': ' + this.translate.instant('WRONG_PATERN'));
      } else {
        this.documentForm.get('DocumentInvoicingDate').setValue(new Date(Date.UTC(dateDocInv.getFullYear(),
         dateDocInv.getMonth(), dateDocInv.getDate())));
      }
    }
    if (isValidDates) {
      this.prepareDocumentToUpdate();
      if (this.updateDocumentCondition()) {
        this.setDateWithTime();
        this.document.IdUsedCurrencyNavigation = null;
        const objectToSave = new ObjectToSend(this.document);
        this.documentService.updateDocumentFields(objectToSave).subscribe(x => {
          this.isAbledToMerge = x.objectData.isAbledToMerge;
          this.document.IdUsedCurrencyNavigation = x.objectData.IdUsedCurrencyNavigation;
          if(this.documentForm.controls['DocumentOtherTaxesWithCurrency']){

            this.documentForm.controls['DocumentOtherTaxesWithCurrency'].setValue(x.objectData.DocumentOtherTaxesWithCurrency)
          }
          if (initDataSource) {
            this.getDocumentLines();
          }
        });
      }
    }
  }

  setDateWithTime() {
    const dateNow = new Date();
    this.document.DocumentDate.setHours(dateNow.getHours());
    this.document.DocumentDate.setMinutes(dateNow.getMinutes());
    this.document.DocumentDate.setSeconds(dateNow.getSeconds());
  }
  public getDocumentLines() { }

  public isGridEmpty() {
    if(this.documentLineGrid && this.documentLineGrid.view){
    return this.documentLineGrid.view && this.documentLineGrid.view.data && this.documentLineGrid.view.data.length > 0;
    }else{
      return false;
    }
  }

  changeOtherTaxValue(event) {
    this.prepareDocumentToUpdate();
    if (this.updateDocumentCondition()) {
      const objectToSave = new ObjectToSend(this.document);
      this.documentService.updateDocumentFields(objectToSave).subscribe(x => {
        this.documentService.updateDocumentInRealTime(this.document.Id).subscribe(y => {
          y.objectData.DocumentDate = new Date(y.objectData.DocumentDate);
          y.objectData.DocumentInvoicingDate = new Date(y.objectData.DocumentInvoicingDate);
          this.documentForm.patchValue(y.objectData);
        });
      });
    }
  }
  idSettlementModeValueChange(event) {
    this.documentForm.get('IdSettlementMode').setValue(event);
    this.prepareDocumentToUpdate();
    if (this.updateDocumentCondition() && this.documentForm.controls['IdDocumentStatus'].value === documentStatusCode.Provisional) {
      const objectToSave = new ObjectToSend(this.document);
      this.documentService.updateDocumentFields(objectToSave).subscribe(y=>{
      });
    }
  }

  /** save market number, delivery period, BC code , project code */
  saveDocumentVarchar(){
    this.prepareDocumentToUpdate();
    if (this.updateDocumentCondition()) {
    const objectToSave = new ObjectToSend(this.document);
    this.documentService.updateDocumentFields(objectToSave).subscribe(x => {
    });
  }
    }
  public initFiniatialCommitmentDataSource() { }
  public updateDocumentCondition(): boolean {
    return this.documentForm.valid && (this.documentForm.controls['Id'].value > 0);
  }
  prepareDocumentToUpdate(files?: Array<FileInfo>) {
    if (this.currentDocument) {
      this.document = this.currentDocument;
      Object.assign(this.document, this.documentForm.getRawValue());
      this.document.IdUsedCurrency = this.documentForm.controls['IdCurrency'].value;
      this.document.FilesInfos = files;
    } else {
      this.document = new Document(null, this.documentForm.getRawValue(), files);
      if(this.documentForm.controls['FilesInfos']){
        this.documentForm.controls['FilesInfos'].setValue(files);
      }

    }
    this.document.IsSaleDocumentType = this.isSalesDocumment;
  }
  public selectedFiles($event) {
    this.prepareDocumentToUpdate($event);
    if (this.updateDocumentCondition()) {
      this.documentService.updateDocumentAfterImportFile(this.document).subscribe();
    }
  }
  public destroy() {
    this.setDataEmpty();
    // for search Item modal
    this.searchItemService.idDocument = undefined;
    this.searchItemService.code = undefined;
    this.searchItemService.idSupplier = undefined;
    this.searchItemService.typeSupplier = undefined;
    this.searchItemService.supplierName = undefined;
    this.searchItemService.disableFields = true;
    this.searchItemService.searchItemDocumentType = undefined;
    this.searchItemService.isFromSearchItem_supplierInetrface = true;
    this.searchItemService.hideDocumentDetail = false;
    this.documentForm = undefined;
    this.document = undefined;
  }
  public setDataEmpty() {
    this.service.otherData = [];
    this.service.DataToImport = [];
    this.service.data = [];
  }

  public showSettlementDetail(settlement: any) {
    settlement.HideSaveButton = true;
    this.formModalDialogService.openDialog(SettlementConstant.DETAIL_PAY, PopUpSettlementDisposalComponent,
      this.viewRef, null, settlement, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  ngOnInit() {
    this.loadRoles();
  }


  public loadRoles() {
    this.rolesService.ListRoleConfigsAsObservable().subscribe((roledata: Array<any>) => {
      // this.rolesService.hasOnlyRoles(RoleConfigConstant.SuperAdminConfig).then(x => this.isSuperAdminRole = x);
      this.loadUpdateValidDocumentRole();
      this.loadPrintDocumentRole();
      this.loadDeleteValidDocumentRole();
      this.loadValidDocumentRole();
      this.loadDeleteReservedDocumentLineRole();
    });
  }

  public changeTtcPrice() {
    
    if (this.documentForm && this.documentForm.controls['Id'] && this.documentForm.controls['Id'].value && this.documentForm.controls['DocumentTtcpriceWithCurrency'] && this.documentForm.controls['DocumentTtcpriceWithCurrency'].value &&
      this.documentForm.controls['DocumentTtcpriceWithCurrency'].value != this.documentService.documentTtcPrice) {
      const confirmButtonText = `${this.translate.instant('UPDATE')}`;
      this.swalWarrings.CreateSwal(this.translate.instant('UPDATE_TTC_PRICE_MESSAGE'), this.translate.instant('UPDATE_TTC_PRICE_TITLE'), confirmButtonText,
        undefined, false, true, false).then((result) => {
        if (result.value) {
          if( this.documentForm.controls['DocumentTtcpriceWithCurrency'] &&  this.documentForm.controls['DocumentTtcpriceWithCurrency'].value){
          var newTtc =   this.documentForm.controls['DocumentTtcpriceWithCurrency'].value;
          }
          this.documentForm.controls['DocumentTtcpriceWithCurrency'].setValue(this.documentService.documentTtcPrice);
          this.documentService.updateDocumentAfterChangeTtcPrice(this.documentForm.controls['Id'].value, newTtc).subscribe((x) => {
            if (!x.objectData) {
              this.documentForm.controls['DocumentTtcpriceWithCurrency'].setValue(this.documentService.documentTtcPrice);
              this.growlService.ErrorNotification(this.translate.instant('ERROR_CHANGE_TTC'));
            } else {
              this.documentService.documentTtcPrice=this.documentForm.controls['DocumentTtcpriceWithCurrency'].value;
              if (x.objectData.DocumentDate) {
                x.objectData.DocumentDate = new Date(x.objectData.DocumentDate);
              }
              if (x.objectData && x.objectData.DocumentInvoicingDate) {
                x.objectData.DocumentInvoicingDate = new Date(x.objectData.DocumentInvoicingDate);
              }
              this.documentService.documentTtcPrice = x.objectData.DocumentTtcpriceWithCurrency;
              this.documentForm.patchValue(x.objectData);
              this.documentLineGrid.itemForm.patchValue(x.objectData);
              this.documentLineGrid.loadItems();
              this.documentTaxeResume.splice(0,);
              x.objectData.DocumentTaxsResume.forEach(element => {
                this.documentTaxeResume.push(element);
              });
            }
           
          });
        } else {
          this.documentForm.controls['DocumentTtcpriceWithCurrency'].setValue(this.documentService.documentTtcPrice);
        }
      });
    }
  }
  displaySettlements(data: any) { }
  checkForPreviousProvisinalDSA() { }
  prepareExpenseLines(data: any) { }
  CallngOnInit() { }
  deleteLinesInTheGridAfterChangingSupplier() { }
  getCompanyParams() {
    this.documentLineGrid.getCompanyParams();
  }

  /**
   * focusOnAddLine
   */
  public focusOnAddLine() { }
  public loadPrintDocumentRole() { }
  public loadUpdateValidDocumentRole() { }
  public loadDeleteValidDocumentRole() { }
  public loadValidDocumentRole() { }
  public loadDeleteReservedDocumentLineRole() { }
  closeLine() {
    this.documentLineGrid.closeEditor();
  }
  selectedTier(data : any){
  };
  public loadVehicleList(){};
}
