import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewContainerRef} from '@angular/core';
import {GridPurchaseInvoiceAssestsBudgetComponent} from '../grid-purchase-invoice-assests-budget/grid-purchase-invoice-assests-budget.component';
import {KeyboardConst} from '../../../constant/keyboard/keyboard.constant';
import {CrudGridService} from '../../../sales/services/document-line/crud-grid.service';
import {digitsAfterComma, maxQuantity, minQuantity, ValidationService} from '../../../shared/services/validation/validation.service';
import {DocumentFormService} from '../../../shared/services/document/document-grid.service';
import {DocumentService} from '../../../sales/services/document/document.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WarehouseService} from '../../../inventory/services/warehouse/warehouse.service';
import {WarehouseItemService} from '../../../inventory/services/warehouse-item/warehouse-item.service';
import {FormBuilder, Validators} from '@angular/forms';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {CompanyService} from '../../../administration/services/company/company.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {SearchItemService} from '../../../sales/services/search-item/search-item.service';
import {TiersService} from '../../services/tiers/tiers.service';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {DetailsProductComponent} from '../../../shared/components/item/details-product/details-product.component';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {SearchConstant} from '../../../constant/search-item';
import {ListDocumentService} from '../../../shared/services/document/list-document.service';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {NegotitateQtyComponent} from '../negotitate-qty/negotitate-qty.component';
import {NegotitateQtyService} from '../../services/negotitate-qty/negotitate-qty.service';
import {MeasureUnitService} from '../../../shared/services/mesure-unit/measure-unit.service';
import {StarkPermissionsService, StarkRolesService} from '../../../stark-permissions/stark-permissions.module';
import {RoleConfigConstant} from '../../../Structure/_roleConfigConstant';
import {DocumentEnumerator, documentStatusCode} from '../../../models/enumerators/document.enum';
import {ReducedCompany} from '../../../models/administration/reduced-company.model';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ItemConstant} from '../../../constant/inventory/item.constant';
import { DocumentTaxsResume } from '../../../models/sales/document-Taxs-Resume.model';
import { ItemService } from '../../../inventory/services/item/item.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { UserWarehouseService } from '../../../inventory/services/user-warehouse/user-warehouse.service';
@Component({
  selector: 'app-purchase-order-grid',
  templateUrl: './purchase-order-grid.component.html',
  styleUrls: ['./purchase-order-grid.component.scss']
})
export class PurchaseOrderGridComponent extends GridPurchaseInvoiceAssestsBudgetComponent implements OnInit, OnDestroy {
  /**
   * Grid settingsproprety
   */
  public gridSettings: GridSettings = this.documentListService.documentLineGridSettings;
  @Input() DocumentLineNegotiationOptions: boolean;
  @Input() documentTaxeResume: DocumentTaxsResume [];
  @Output() selectedLine: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeDocumentFormValue: EventEmitter<any> = new EventEmitter<any>();
  public keyAction;
  item: number;
  public FormatNumber = SharedConstant.NUMBER_FORMAT;
  public deleteMultipleLinesRole: boolean;
  public deleteLineRole: boolean;
  currentCompany: ReducedCompany;
  public formatNewSalesPrice ='#,##.000';
  public updateDiscountRole = false;
  public updatePriceRole = false ;
  public showImportLines = false;
  public zero = NumberConstant.ZERO;
  public formatDate = this.translateService.instant(SharedConstant.DATE_FORMAT);
  public removeLine = false ;
  public haveNegotiatedPermission = false ;
  // @Output() callLoadQuotion = new EventEmitter<boolean>();
  /**
   *
   */
  constructor(protected negotitateQtyService: NegotitateQtyService,
              protected service: CrudGridService, public validationService: ValidationService,
              public documentFormService: DocumentFormService, public documentService: DocumentService,
              public viewRef: ViewContainerRef, protected router: Router,
              protected warehouseService: WarehouseService, protected warehouseItemService: WarehouseItemService,
              protected formBuilder: FormBuilder, protected swalWarrings: SwalWarring, protected serviceComany: CompanyService,
              protected growlService: GrowlService, protected translateService: TranslateService, protected searchItemService: SearchItemService,
              protected renderer: Renderer2, protected tiersService: TiersService,
              private formModalDialogService: FormModalDialogService, public documentListService: ListDocumentService,
              protected fb: FormBuilder, protected modalService: ModalDialogInstanceService, protected measureUnitService: MeasureUnitService,
              protected activatedRouter: ActivatedRoute,
              protected permissionsService: StarkPermissionsService, protected rolesService: StarkRolesService, public itemService: ItemService,
              public authService: AuthService, protected localStorageService : LocalStorageService, protected userWarehouseService : UserWarehouseService) {
    super(service, validationService, documentFormService, documentService, viewRef, router,
      activatedRouter, warehouseService, warehouseItemService, formBuilder, swalWarrings, serviceComany, localStorageService,
      growlService, translateService, searchItemService, renderer, tiersService, fb, modalService, documentListService, measureUnitService
      , permissionsService, rolesService, itemService,authService, userWarehouseService);
    this.negotitateQtyService.loadItems.subscribe(x => {
      this.modalService.closeAnyExistingModalDialog();
      this.getDocumentLinesOperation(x, true);
      this.closeEditor();
    });
  }

  getCurrentCompany() {
    this.serviceComany.getReducedDataOfCompany().subscribe((company : ReducedCompany) => {
      this.currentCompany = company;
    });
  }

  public openHistory() {
    this.formModalDialogService.openDialog('PRODUCT_LIST', DetailsProductComponent,
      this.viewRef, this.onCloseSearchFetchModal.bind(this), this.item, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  onCloseSearchFetchModal(data): void {
    this.modalService.closeAnyExistingModalDialog();
    this.selectMvtQty();
  }

  public ngOnInit(): void {
    this.getCurrentCompany();
    this.onKeyActionHandler();
    this.LoadDeleteMultipleDocumentLinesRole();
    this.LoadDeleteDocumentLineRole();
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    this.updateDiscountRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_PURCHASE_DISCOUNT);
    this.updatePriceRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_PURCHASE_PRICE);
    this.haveNegotiatedPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.NEGOTIATION);

  }

  onKeyActionHandler() {
    this.keyAction = (event) => {
      const keyName = event.key;
      if (keyName === KeyboardConst.ESCAPE) {
        this.onCloseSearchFetchModal(null);
      }
    };
    document.addEventListener(SearchConstant.KEY_UP, this.keyAction);
  }

  ngOnDestroy() {
    document.removeEventListener(SearchConstant.KEY_DOWN, this.keyAction, false);
  }

  public documentLineClickHandler({isEdited, dataItem, rowIndex}, SetedValue?: boolean, data?: any): void {
    if(!this.removeLine){
    super.documentLineClickHandler({isEdited, dataItem, rowIndex}, SetedValue, data);
    this.selectedLine.emit(dataItem);
    this.item = dataItem.IdItem;
    this.selectableSettings = {
      checkboxOnly: false,
      mode: 'multiple'
    };
  }
  this.removeLine = false ;
  }

  public negotitateQty(dataItem) {
    const data = {};
    data['dataItem'] = dataItem;
    data['formatOption'] = this.formatOption;
    this.formModalDialogService.openDialog('NEGOTITATION', NegotitateQtyComponent,
      this.viewRef, null, data, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  removeDocumentLine({isEdited, dataItem, rowIndex, sender}) {
    this.removeLine = true ;
    super.removeDocumentLine({isEdited, dataItem, rowIndex, sender});
    this.selectedLine.emit(undefined);
  }

  closeEditor() {
    super.closeEditor();
  }

  setDisabled() {
    super.setDisabled();
    this.gridFormGroup.controls['HtUnitAmountWithCurrency'].disable();
  }

  isAbleToGetDocLines(fromsearchItemInterface: boolean, idDoc: number, isFromNegtiation: boolean = false): boolean {
    return isFromNegtiation ? this.itemForm && this.itemForm.controls['Id'].value === idDoc && fromsearchItemInterface &&
      !this.negotitateQtyService.serviceHasEmitData : super.isAbleToGetDocLines(fromsearchItemInterface, idDoc);
  }

  getDocumentLinesOperation(idDoc, isFromNegtiation: boolean = false) {
    if (isFromNegtiation) {
      if (this.isAbleToGetDocLines(true, idDoc, isFromNegtiation)) {
        this.negotitateQtyService.serviceHasEmitData = true;
        this.cancelHandler();
        this.loadItems();
        this.documentService.updateDocumentInRealTime(this.itemForm.controls['Id'].value).toPromise().then(y => {
          y.objectData.DocumentDate = new Date(y.objectData.DocumentDate);
          // to change form value in parent after updating
          this.changeDocumentFormValue.emit(y.objectData);
          this.documentTaxeResume.splice(0,);
          y.objectData.DocumentTaxsResume.forEach(element => {
            this.documentTaxeResume.push(element);
          });
        });
      }
    } else {
      super.getDocumentLinesOperation(idDoc);
    }
  }

  setQtyValidateor() {
    const minValue = this.gridFormGroup.controls['IsNegotitationAccpted'].value ? this.gridFormGroup.controls['MovementQty'].value : 1;
    const idMeasureUnit = this.gridFormGroup.controls['IdMeasureUnit'].value;
    if (idMeasureUnit > 0) {
      this.measureUnitService.getById(idMeasureUnit).subscribe(data => {
        if (data && data.IsDecomposable && data.DigitsAfterComma) {
          this.gridFormGroup.controls['MovementQty'].setValidators([minQuantity(this.gridFormGroup.controls['MovementQty'].value),
          maxQuantity(this.gridFormGroup.controls['MovementQty'].value),
          Validators.pattern('^[0-9-]*'),
          digitsAfterComma(data.DigitsAfterComma)]);
        } else {
          this.gridFormGroup.controls['MovementQty'].setValidators([minQuantity(this.gridFormGroup.controls['MovementQty'].value),
          maxQuantity(this.gridFormGroup.controls['MovementQty'].value),
          Validators.pattern('^[0-9-]*')]);
        }
      });
    } else {
      this.gridFormGroup.controls['MovementQty']
        .setValidators([minQuantity(NumberConstant.ONE),
        Validators.pattern('^[0-9-]*')]);
    }
  }

  public LoadDeleteMultipleDocumentLinesRole() {
    this.deleteMultipleLinesRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_MULTIPLE_LINES_PURCHASE);
  }

  public LoadDeleteDocumentLineRole() {
    this.deleteLineRole = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_LINE_PURCHASE);
  }

  public showBtnAdd() {
    if ((this.itemForm.controls['IdDocumentStatus'].value === documentStatusCode.Valid && !this.updateValidDocumentRole)
      ||
      (this.itemForm.controls['IdDocumentStatus'].value !== documentStatusCode.Provisional &&
        this.itemForm.controls['IdDocumentStatus'].value !== documentStatusCode.Valid)
      || (this.itemForm.controls['DocumentTypeCode'].value !== DocumentEnumerator.PurchaseOrder &&
        this.itemForm.controls['IdDocumentStatus'].value !== documentStatusCode.Provisional)) {
      return false;
    } else {
      return true;
    }
  }

  enableOrDisableTiers() {
    if (!this.fromDevisInterface) {
      if (this.itemForm && this.itemForm.controls['IdTiers']) {
        // if the document is in serach item interface the tiers must be disabled
        if (this.itemForm.controls['isFromSearch'] && this.itemForm.controls['isFromSearch'].value) {
          this.itemForm.controls['IdTiers'].disable();
        } else {
          if ((!this.view || !this.view.total || this.view.total === 0) && !this.isContainsLines) {
            this.itemForm.controls['IdTiers'].enable();
          } else {
            this.itemForm.controls['IdTiers'].disable();
          }
        }

      }
    }
  }

  }

