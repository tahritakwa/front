import {MeasureUnitService} from '../../../shared/services/mesure-unit/measure-unit.service';
import {ItemService} from '../../../inventory/services/item/item.service';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ClaimService} from '../../services/claim/claim.service';
import {Subscription} from 'rxjs/Subscription';
import {ClaimEnumerator} from '../../../models/enumerators/claim.enum';
import {ClaimConstant} from '../../../constant/helpdesk/claim.constant';
import {TranslateService} from '@ngx-translate/core';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {DocumentFormService} from '../../../shared/services/document/document-grid.service';
import {isNullOrUndefined} from 'util';
import {Contact} from '../../../models/shared/contact.model';
import {ClaimTypeService} from '../../services/claim-type/claim-type.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {ClaimStatusService} from '../../services/claim-status/claim-status.service';
import {ItemDropdownComponent} from '../../../shared/components/item-dropdown/item-dropdown.component';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {DocumentEnumerator} from '../../../models/enumerators/document.enum';
import {DocumentConstant} from '../../../constant/sales/document.constant';
import {ClaimQuery} from '../../../shared/utils/dropdown-query';
import {Document} from '../../../models/sales/document.model';
import {StockCorrectionConstant} from '../../../constant/stock-correction/stock-correction.constant';
import {SupplierDropdownComponent} from '../../../shared/components/supplier-dropdown/supplier-dropdown.component';
import {TiersTypeEnumerator} from '../../../models/enumerators/tiers-type.enum';
import {HelpDeskEnumerator} from '../../../constant/helpdesk/claim.enum';
import {TiersConstants} from '../../../constant/purchase/tiers.constant';
import { Tiers } from '../../../models/achat/tiers.model';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

const SHOW = '/show/';
const BLANK_PAGE_TARGET = '_blank';

@Component({
  selector: 'app-add-claim-details',
  templateUrl: './add-claim-details.component.html',
  styleUrls: ['./add-claim-details.component.scss']
})
export class AddClaimDetailsComponent implements OnInit, OnDestroy, OnChanges{

  @Input() parent: FormGroup;
  @Input() isParentUpdateMode = false;
  @Input() claimDetailsType: any;
  @Input() claimData: any;
  @Input() isClaimAccepted: any;
  @Input() isClaimRefused: any;
  @Input() builder: FormBuilder;
  @Input() haveUpdatePermission =false;
  @Input() haveAddPermission =false;
  @Input() haveGeneratePermission =false;
  @Output() parentGenerateMovementOut: EventEmitter<any> = new EventEmitter();
  @Output() parentGenerateMovementIn: EventEmitter<any> = new EventEmitter();
  @Output() parentOnUpdateSaleDeliveryDocumentClicked: EventEmitter<any> = new EventEmitter();
  @Output() parentOnUpdateAssetDocumentClicked: EventEmitter<any> = new EventEmitter();
  @Output() parentOnUpdateBSDocumentClicked: EventEmitter<any> = new EventEmitter();
  @Output() parentSelectedItem: EventEmitter<any> = new EventEmitter();
  @Output() parentSelectedTier: EventEmitter<any> = new EventEmitter();


  @ViewChild(ItemDropdownComponent) public itemDropDown;
  @ViewChild(SupplierDropdownComponent) public supplierDropDown;

  public IsinitialiseQty = false;
  public idType: any;
  public isUpdateMode = false;
  public isSubmitted = false;
  public idClaimRequestSubscription: Subscription;
  public choosenFilter: string;
  public choosenFilterNumber = NumberConstant.ZERO;
  public predicate: PredicateFormat;
  public ClientSelected: any;
  public SupplierSelected: any;
  public ContactSelected: Contact;
  public claimEnumerator: ClaimEnumerator = new ClaimEnumerator();
  public isInitialPage: boolean;
  public isSecondPage: boolean;
  public isSecondDeffectivePage: boolean;
  public isSecondMissingPage: boolean;
  public isSecondExtraPage: boolean;
  public isLastPage: boolean;
  public claimQty: number;
  public isSupplierSelected = false;
  public blLineSumQty = 0;
  public hideSearch: boolean = false;
  public idmeasureunit: any;
  public oldIdItem: boolean;
  public isSwhoOnlySelected: boolean;
  /** document Enumerator */
  public documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  public tierType: TiersTypeEnumerator;
  public tierTypePlaceHolder: string;
  public listTiers: Array<Tiers>;
  public idTier: number;
  public claimAddTierForm: FormGroup;
  public hasUpdatePermission: boolean;
  public hasAddPermission: boolean;

  constructor(public claimServices: ClaimService, public claimTypeServices: ClaimTypeService,
              public claimStatusServices: ClaimStatusService, public validationService: ValidationService,
              private growlService: GrowlService, public translate: TranslateService, private formBuilder: FormBuilder,
              protected formModalDialogService: FormModalDialogService,
              protected viewRef: ViewContainerRef,
              public documentFormService: DocumentFormService,
              public itemService: ItemService, public measureUnitService: MeasureUnitService,
              private authService: AuthService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['claimDetailsType']) {
      this.setTierType();
    }
  }
  public createAddForm(): void {
    this.claimAddTierForm = this.formBuilder.group({
      IdTiers: [{value: '', disabled: false}, Validators.required],
    })}
  get isOldDocument() {
    return (this.parent.controls.ReferenceOldDocument.value !== null && this.parent.controls.ReferenceOldDocument.value !== undefined
      && this.parent.controls.ReferenceOldDocument.value !== '')
      && this.parent.controls.isSecondDeffectivePage.value
      && isNullOrUndefined(this.parent.controls.IdMovementOut.value);
  }

  get showStockMovementOut() {
    return this.parent.controls.isSecondMissingPage.value &&
      (this.parent.controls.IdClaimStatus.value === 1 || this.parent.controls.IdClaimStatus.value === 2);
  }

  get showStockMovementIn() {
    return this.parent.controls.isSecondExtraPage.value &&
      (this.parent.controls.IdClaimStatus.value === 1 || this.parent.controls.IdClaimStatus.value === 2);
  }

  get showStockMovementOutOfDeffective() {
    return this.parent.controls.isSecondDeffectivePage.value
      && this.parent.controls.IdClaimStatus.value === 3
      && isNullOrUndefined(this.parent.controls.IdMovementOut.value)
      && !this.claimServices.hasOnlyOldDocument;
  }

  ngOnInit() {
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CLAIM_PURCHASE);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_CLAIM_PURCHASE);
    this.createAddForm();
    this.isUpdateMode = this.isParentUpdateMode;
    if (this.isUpdateMode) {
      this.LoadClaimDetails(this.claimData);
      this.oldIdItem = this.parent.controls['IdItem'].value;
      this.isSwhoOnlySelected = true;
      this.itemService.GetItemTier(this.oldIdItem).subscribe(res => {
        this.listTiers = res.objectData.map(x=>x.IdTiersNavigation);
      });
     this.claimAddTierForm.controls['IdTiers'].setValue(this.parent.controls['IdFournisseur'].value);
    }
    if (isNullOrUndefined(this.parent.controls['IdItem'].value)) {
      this.disableItemDropdown();
    }
    this.isSecondPage = true;
    this.parent.patchValue({
      isSecondDeffectivePage: this.claimDetailsType === ClaimConstant.Deffective,
      isSecondExtraPage: this.claimDetailsType === ClaimConstant.Extra,
      isSecondMissingPage: this.claimDetailsType === ClaimConstant.Missing
    });
    if((!this.haveUpdatePermission && this.isUpdateMode) || !this.haveAddPermission ){
      this.claimAddTierForm.disable();
    }
  }

  ngOnDestroy() {
    if (this.idClaimRequestSubscription) {
      this.idClaimRequestSubscription.unsubscribe();
    }
    this.claimServices.OnDestroy();
  }

  disableItemDropdown() {
    this.parent.controls['IdItem'].disable();
    this.hideSearch = true;
  }
  disableTierDropdown() {
    this.parent.controls['IdTiers'].disable();
    this.hideSearch = true;
  }
  enableItemDropdown() {
    this.parent.controls['IdItem'].enable();
    this.hideSearch = false;
  }

  LoadClaimDetails(res: any) {
    this.claimServices.setEnableAllButton(true);
    this.blLineSumQty = res.ClaimMaxQty;
    this.SupplierSelected = res.IdFournisseurNavigation;
    this.ClientSelected = res.IdClientNavigation;

    if (res.ClaimType === ClaimConstant.Deffective) {
      this.parent.patchValue({
        IdTiers: res.IdClientNavigation.Id,
        IdTiersReference: isNullOrUndefined(res.IdClientNavigation) ? '' : res.IdClientNavigation.Name,
      });

    } else {
      this.parent.patchValue({
        IdTiersReference: isNullOrUndefined(res.IdFournisseurNavigation) ? '' : res.IdFournisseurNavigation.Name,
        IdTiers: res.IdFournisseurNavigation.Id
      });
    }
    this.parent.patchValue({
      IdItemReference: isNullOrUndefined(res.IdItemNavigation) ? '' : res.IdItemNavigation.Code + '-' + res.IdItemNavigation.Description
    });
    this.isSupplierSelected = true;

  }


  /**
   * on select Tiers Prepare supplier
   * @param $event
   */
  receiveClaimSupplierSelected($event) {
    // Intialise currency and contact with null value in every selection

    this.parent.patchValue({
      IdItem: undefined,
      ClaimContact: undefined,
      ClaimQty: undefined,
      ClaimMaxQty: undefined,
      ReferenceOldDocument: undefined
    });
    if (this.itemDropDown) {
      this.itemDropDown.tiersAssociated = undefined;
      if (this.itemDropDown.filtersItemDropdown && this.itemDropDown.filtersItemDropdown.idTiers) {
        this.itemDropDown.filtersItemDropdown.idTiers = undefined;
      }
    }
    if (this.claimDetailsType === 'D') {
      this.initdropdown();
    }
    this.claimServices.saleDeliveryDocument = new Document();
    this.claimServices.saleInvoiceDocument = new Document();
    this.claimServices.bSDocumentToUpdate = new Document();
    this.claimServices.setEnableAllButton(false);
    // Prepare Supplier
    const supplierReturn = this.documentFormService.prepareSupplier($event);
    if (supplierReturn) {
      this.enableItemDropdown();

      if (this.parent.controls['isSecondDeffectivePage'].value) {
        // modify the list of BL
        this.ClientSelected = $event.supplierFiltredDataSource.find(x => x.Id === $event.IdTiers.value);
        this.parent.patchValue({
          IdTiersReference: this.ClientSelected.Name,
        });
      } else {
        this.SupplierSelected = $event.supplierFiltredDataSource.find(x => x.Id === $event.IdTiers.value);
        this.parent.patchValue({
          IdTiersReference: this.SupplierSelected.Name,
        });
        this.itemDropDown.selectedTiers = $event.IdTiers.value;
        this.itemDropDown.tiersAssociated = new Array<number>();
        this.itemDropDown.tiersAssociated.push($event.IdTiers.value);
        this.initdropdown();
      }
    } else {
      this.disableItemDropdown();
    }
  }

  initdropdown() {
    this.itemDropDown.itemValue = '';
    this.itemDropDown.gridState.skip = 0;
    this.itemDropDown.initDataSource();
  }

  generateMovementOut() {
    this.claimServices.disableButtonWhenTreatment = true;
    this.parentGenerateMovementOut.emit();
  }


  generateMovementIn() {
    this.claimServices.disableButtonWhenTreatment = true;
    this.parentGenerateMovementIn.emit();
  }
    updateSaleDeliveryDocument() {
    this.claimServices.disableButtonWhenTreatment = true;
    this.parentOnUpdateSaleDeliveryDocumentClicked.emit();
  }

  generateSaleAssetDocument() {
    this.claimServices.disableButtonWhenTreatment = true;
    this.parentOnUpdateAssetDocumentClicked.emit();
  }

  updateBSDocument() {
    this.claimServices.disableButtonWhenTreatment = true;
    this.parentOnUpdateBSDocumentClicked.emit();
  }


  /**
   * Navigate To DocumentDetail on click document code
   */
  onClickGoToDocument(documentTypeCode: string, idDocumentStatus: number, idDocument: number) {
    let url;
    // Create Url according to document type
    if (documentTypeCode === DocumentEnumerator.SalesDelivery) {
      url = DocumentConstant.SALES_DELIVERY_URL.concat(SHOW);
    }
    if (documentTypeCode === DocumentEnumerator.SalesInvoices) {
      url = DocumentConstant.SALES_INVOICE_URL.concat(SHOW);
    }
    if (documentTypeCode === DocumentEnumerator.SalesAsset) {
      url = DocumentConstant.SALES_ASSET_URL.concat(SHOW);
    }
    if (documentTypeCode === DocumentEnumerator.BS) {
      url = StockCorrectionConstant.BS_URL.concat(SHOW);
    }
    if (documentTypeCode === DocumentEnumerator.BE) {
      url = StockCorrectionConstant.BE_URL.concat(SHOW);
    }
    window.open(url.concat(idDocument).concat('/').concat(idDocumentStatus), BLANK_PAGE_TARGET);
  }

  /**Select item */
  public itemSelect($event) {
    if (!isNullOrUndefined($event)) {
      const idItem = $event.itemForm.controls['IdItem'].value;
      this.parentSelectedItem.emit(idItem);
      this.itemService.GetItemTier(idItem).subscribe(res => {
        this.listTiers = res.objectData.map(x=>x.IdTiersNavigation);
      });
    }
  }

  public itemAfterSelect(idItem) {
    this.claimServices.hasSaleDeliveryToUpdate = false;
    this.claimServices.hasSaleInvoiceToGenerateSaleAsset = false;
    this.claimServices.hasBSToUpdate = false;
    this.claimServices.hasOnlyOldDocument = false;
    this.parent.controls.ReferenceOldDocument.clearValidators();
    if (!isNullOrUndefined(idItem) && idItem > 0) {
      if (this.parent.controls.isSecondDeffectivePage.value) {
        if (!this.claimServices.hasOnlyOldDocument) {
          this.loadSalesDeliveryData();
        }
      } else {
        this.claimServices.setEnableAllButton(true);
        //this.verifyExistingPurchaseDocument();
      }
    } else {
      this.clearClaimForm();
    }
  }

  public itemFocusOut($event) {
    const idItem = $event.itemForm.controls['IdItem'].value;
    if ( !isNullOrUndefined(this.oldIdItem) && idItem !== this.oldIdItem) {
      this.oldIdItem = idItem;
      $event.itemForm.controls['ClaimQty'].reset();
    }
  }

  verifyExistingPurchaseDocument() {
    const dropdownpredicate = new ClaimQuery();
    dropdownpredicate.IdTiers = this.parent.controls.IdTiers.value;
    dropdownpredicate.IdItem = this.parent.controls.IdItem.value;
    this.claimServices.VerifyExistingPurchaseDocument(dropdownpredicate).subscribe(
      result => {
        if (result) {
          this.claimServices.setEnableAllButton(true);
        } else {
          this.claimServices.setEnableAllButton(false);
          this.growlService.warningNotification(this.translate.instant(ClaimConstant.CLAIM_UNSUCCESSFULL_DATA_RETRIEVE));
        }
      });
  }

  loadSalesDeliveryData() {
    const dropdownpredicate = new ClaimQuery();
    dropdownpredicate.IdTiers = this.parent.controls.IdTiers.value;
    dropdownpredicate.IdItem = this.parent.controls.IdItem.value;
    dropdownpredicate.Id = this.parent.controls.Id.value;
    this.claimServices.GetBLFromClaimItem(dropdownpredicate).subscribe(
      result => {
        if (!isNullOrUndefined(result)) {
          this.claimServices.hasOnlyOldDocument = false;
          this.claimServices.disableOldButton = true;
          this.parent.controls.ReferenceOldDocument.disable();
          this.claimServices.setEnableAllButton(true);
          let documentValue = result;
          this.claimServices.hasSaleDeliveryToUpdate = true;
          this.claimServices.saleDeliveryDocument = new Document(result.DocumentLine, result);
          this.parent.patchValue({
            IdDocument: documentValue.Id,
            IdUsedCurrency: documentValue.IdUsedCurrency,
            IdDocumentLine: documentValue.DocumentLine.find(x => x.IdItem === this.parent.controls.IdItem.value).Id,
            IdWarehouse: documentValue.DocumentLine.find(x => x.IdItem === this.parent.controls.IdItem.value).IdWarehouse,
            ClaimMaxQty: documentValue.DocumentLine.find(x => x.IdItem === this.parent.controls.IdItem.value).MovementQty,
          });
        } else {
          this.loadSalesInvoiceData();
        }
      });
  }

  loadSalesInvoiceData() {
    const dropdownpredicate = new ClaimQuery();
    dropdownpredicate.IdTiers = this.parent.controls.IdTiers.value;
    dropdownpredicate.IdItem = this.parent.controls.IdItem.value;
    dropdownpredicate.Id = this.parent.controls.Id.value;
    this.claimServices.GetSIFromClaimItem(dropdownpredicate).subscribe(result => {
      if (!isNullOrUndefined(result)) {
        this.claimServices.hasOnlyOldDocument = false;
        this.claimServices.disableOldButton = true;
        this.parent.controls.ReferenceOldDocument.setErrors(null);
        this.parent.controls.ReferenceOldDocument.disable();
        this.claimServices.setEnableAllButton(true);
        let documentValue = result;
        this.claimServices.hasSaleInvoiceToGenerateSaleAsset = true;
        this.claimServices.saleInvoiceDocument = new Document(result.DocumentLine, result);
        this.parent.patchValue({
          IdDocument: documentValue.Id,
          IdUsedCurrency: documentValue.IdUsedCurrency,
          IdDocumentLine: documentValue.DocumentLine.find(x => x.IdItem === this.parent.controls.IdItem.value).Id,
          IdWarehouse: documentValue.DocumentLine.find(x => x.IdItem === this.parent.controls.IdItem.value).IdWarehouse,
          ClaimMaxQty: documentValue.DocumentLine.find(x => x.IdItem === this.parent.controls.IdItem.value).MovementQty,
        });
      } else {
        this.loadStockMovementData();
      }
    });
  }

  loadStockMovementData() {
    const dropdownpredicate = new ClaimQuery();
    dropdownpredicate.IdTiers = this.parent.controls.IdTiers.value;
    dropdownpredicate.IdItem = this.parent.controls.IdItem.value;
    dropdownpredicate.Id = this.parent.controls.Id.value;
    this.claimServices.GetBSFromClaimItem(dropdownpredicate).subscribe(result => {
      if (!isNullOrUndefined(result)) {
        this.claimServices.hasOnlyOldDocument = false;
        this.claimServices.disableOldButton = true;
        this.parent.controls.ReferenceOldDocument.disable();
        this.claimServices.setEnableAllButton(true);
        let documentValue = result;
        this.claimServices.hasBSToUpdate = true;
        this.claimServices.bSDocumentToUpdate = new Document(result.DocumentLine, result);
        this.parent.patchValue({
          IdDocument: documentValue.Id,
          IdUsedCurrency: documentValue.IdUsedCurrency,
          IdDocumentLine: documentValue.DocumentLine.find(x => x.IdItem === this.parent.controls.IdItem.value).Id,
          IdWarehouse: documentValue.DocumentLine.find(x => x.IdItem === this.parent.controls.IdItem.value).IdWarehouse,
          ClaimMaxQty: documentValue.DocumentLine.find(x => x.IdItem === this.parent.controls.IdItem.value).MovementQty,
        });

      } else {
        this.claimServices.setEnableAllButton(true);
        this.parent.controls.ReferenceOldDocument.setValidators(Validators.required);
        this.parent.controls.ReferenceOldDocument.enable();
        this.claimServices.hasOnlyOldDocument = true;
        this.growlService.warningNotification(this.translate.instant(ClaimConstant.CLAIM_UNSUCCESSFULL_DATA_RETRIEVE));
      }
    });
  }

  public clearClaimForm() {
    this.claimServices.hasSaleDeliveryToUpdate = false;
    this.claimServices.saleDeliveryDocument = new Document();
    this.claimServices.hasSaleInvoiceToGenerateSaleAsset = false;
    this.claimServices.saleInvoiceDocument = new Document();
    this.claimServices.hasBSToUpdate = false;
    this.claimServices.bSDocumentToUpdate = new Document();

    this.parent.patchValue({
      StockMovementDocument: undefined
    });
  }

  showOldDocument() {
    this.claimServices.disableOldButton = false;
    this.parent.controls.ReferenceOldDocument.enable();

  }

  showNewDocument() {
    this.claimServices.disableOldButton = true;
    this.parent.controls.ReferenceOldDocument.disable();
    this.parent.controls.ReferenceOldDocument.setValue(undefined);
  }

  public setTierType(claimType?: number) {
    if (claimType) {
      this.claimDetailsType = claimType;
    }
    this.tierType = this.claimDetailsType === HelpDeskEnumerator.Deffective ? TiersTypeEnumerator.Customer : TiersTypeEnumerator.Supplier;
    this.tierTypePlaceHolder = TiersTypeEnumerator.Customer === this.tierType ? ClaimConstant.CHOOSE_CUSTOMER_PLACEHOLDER : ClaimConstant.CHOOSE_SUPPLIER_PLACEHOLDER;
  }

  public getTierTypeLabel(): string {
    return this.tierType === TiersTypeEnumerator.Customer ? TiersConstants.CUSTOMER : TiersConstants.SUPPLIER;
  }
  public selectedValue($event){
    this.parent.controls['IdFournisseur'].setValue($event);
    this.parentSelectedTier.emit($event);

  }
}
