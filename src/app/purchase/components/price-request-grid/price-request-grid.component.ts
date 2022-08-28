import { SharedConstant } from './../../../constant/shared/shared.constant';
import { Component, OnInit, ViewChild, Input, OnDestroy, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { GridComponent } from '@progress/kendo-angular-grid';
import { ContactDropdownComponent } from '../../../shared/components/contact-dropdown/contact-dropdown.component';
import { PriceRequestDetail } from '../../../models/purchase/price-request-detail.model';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { SearchConstant } from '../../../constant/search-item';
import { PurchaseRequestConstant } from '../../../constant/purchase/purchase-request.constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { PredicateFormat, Filter, Relation, Operation } from '../../../shared/utils/predicate';
import { PriceRequestConstant } from '../../../constant/sales/price-request.constant';
import { Tiers } from '../../../models/achat/tiers.model';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { DocumentLineService } from '../../../sales/services/document-line/document-line.service';
import { ContactService } from '../../services/contact/contact.service';
import { ItemService } from '../../../inventory/services/item/item.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { ReducedCompany } from '../../../models/administration/reduced-company.model';
import { CompanyService } from '../../../administration/services/company/company.service';
import { TiersService } from '../../services/tiers/tiers.service';

export const createLineFormGroup = dataItem => new FormGroup({
  'Id': new FormControl(dataItem.Id),
  'IdLine': new FormControl(dataItem.IdLine),
  'IdItem': new FormControl(dataItem.IdItem, Validators.required),
  'IdPriceRequest': new FormControl(Number(dataItem.IdPriceRequest), Validators.required),
  'LabelItem': new FormControl(dataItem.LabelItem),
  'Designation': new FormControl(dataItem.Designation),
  'IdTiersNavigation': new FormControl(dataItem.IdTiersNavigation, Validators.required),
  'IdTiers': new FormControl(dataItem.IdTiers, Validators.required),
  'IdContact': new FormControl(dataItem.IdContact),
  'ContactString': new FormControl(dataItem.ContactString),
  'MovementQty': new FormControl(dataItem.MovementQty, Validators.compose([
    Validators.required,
    Validators.pattern('^[0-9]{1,11}(?:(\,|\.)[0-9]{1,3})?$'),
    Validators.min(NumberConstant.ONE)
  ])),
  'IsDeleted': new FormControl(dataItem.IsDeleted)
});

@Component({
  selector: 'app-price-request-grid',
  templateUrl: './price-request-grid.component.html',
  styleUrls: ['./price-request-grid.component.scss']
})
export class PriceRequestGridComponent implements OnInit, OnDestroy {
  @ViewChild(GridComponent) private grid: GridComponent;
  @ViewChild(ContactDropdownComponent) private contactDropDown;
  @Input() priceRequestForm: FormGroup;
  @Input() id: number;
  @Input() haveAddPermission;
  gridFormGroup: FormGroup;
  private editedRowIndex: number;
  keyAction;
  public isNotValidateToSendMail: boolean;
  public isPriceRequestChaged: boolean;
  public view: PriceRequestDetail[];
  public supplierList: number[] = [];
  isEditingMode: boolean;
  isNew: boolean;
  isTabGridOpen = true;
  hideSearch = false;
  public FormatNumber = SharedConstant.NUMBER_FORMAT;
  public errorItem = false;
  private removedRowIndex: number;
  itemtier = [];
  public selectedTiers;
  haveAddSupplierPermission : boolean;
  haveUpdateSupplierPermission : boolean;
  public currentCompany: ReducedCompany;
  constructor(public documentLineService: DocumentLineService, private serviceItem: ItemService,
    public validationService: ValidationService,
    private contactService: ContactService, private growlService: GrowlService,
    private translate: TranslateService, public viewRef: ViewContainerRef, protected translateService: TranslateService, private serviceComany: CompanyService
    , private serviceTiers: TiersService ,private authService: AuthService) {
    this.keyAction = (event) => {
      const keyName = event.key;
      /*escape keyboard click */
      if (keyName === KeyboardConst.ESCAPE) {
        this.closeEditor();
      }
      /*Enter keyboard click */
      if (keyName === KeyboardConst.ENTER && this.gridFormGroup && this.isTabGridOpen) {
        if (this.errorItem) {
          this.growlService.ErrorNotification(this.translate.instant(PurchaseRequestConstant.ITEM_WITHOUT_MEASURE_UNIT));
        } else {
          if (this.gridFormGroup.valid) {
            event.preventDefault();
            this.saveCurrent();
          } else {
            this.validationService.validateAllFormFields(this.gridFormGroup);
          }
        }
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.keyAction);
    this.documentLineService.priceRequest = new Array<any>();
  }


  public cancelHandler(): void {
    this.closeEditor();
  }

  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
    this.isNew = false;
    this.editedRowIndex = undefined;
    this.gridFormGroup = undefined;
    this.isEditingMode = false;
    this.isNotValidateToSendMail = false;
    this.hideSearch = false;
  }

  public saveCurrent(): void {
    if (this.errorItem) {
      this.growlService.ErrorNotification(this.translate.instant(PurchaseRequestConstant.ITEM_WITHOUT_MEASURE_UNIT));
    } else {
      if (this.gridFormGroup.valid) {
        let elementInGrid;
        if (this.view) {
          elementInGrid = this.view.filter(x => x.IdItem === this.gridFormGroup.controls['IdItem'].value);
        }

        if (elementInGrid && elementInGrid.length > NumberConstant.ZERO && this.isNew) {
          this.growlService.warningNotification(this.translateService.instant(PurchaseRequestConstant.ITEM_EXIST));
        } else {
          this.documentLineService.savePriceRequest(this.gridFormGroup.getRawValue(), this.isNew);
          this.view = this.documentLineService.priceRequest.filter(x => !x.IsDeleted);
          this.isPriceRequestChaged = true;
          this.closeEditor();
        }
      } else {
        this.validationService.validateAllFormFields(this.gridFormGroup);
      }
    }
  }
  public lineClickHandler({ isEdited, dataItem, rowIndex }, SetedValue?: boolean, data?: any): void {
    if (isEdited || (this.gridFormGroup && !this.gridFormGroup.valid) || this.isInEditingMode) {
      return;
    }
    if (this.removedRowIndex >= 0 && rowIndex == this.removedRowIndex) {
      this.removedRowIndex = undefined;
      return;
    }
    this.isEditingMode = true;
    this.isNotValidateToSendMail = true;
    this.gridFormGroup = createLineFormGroup(dataItem);
    this.gridFormGroup.controls[PurchaseRequestConstant.ID_TIERS_NAVIGATION].disable();
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.gridFormGroup);
    this.gridFormGroup.controls['IdItem'].disable();
    this.afterItemSelection(this.gridFormGroup.controls['IdItem'].value);
    this.hideSearch = true;
    this.removedRowIndex = undefined;
  }

  /* Add DocumentLine */
  public addLine(): void {
    this.closeEditor();
    this.isEditingMode = true;
    this.isNotValidateToSendMail = true;
    if (this.priceRequestForm.valid) {
      this.gridFormGroup = createLineFormGroup({
        'Id': NumberConstant.ZERO,
        'IdItem': NumberConstant.ZERO,
        'IdPriceRequest': this.id ? this.id : NumberConstant.ZERO,
        'LabelItem': '',
        'IdTiersNavigation': '',
        'IdTiers': '',
        'Designation': '',
        'IdContact': '',
        'ContactString': '',
        'MovementQty': NumberConstant.ONE,
        'IsDeleted': false,
      });
      this.isNew = true;
      this.gridFormGroup.controls[DocumentConstant.ID_LINE].setValue(this.documentLineService.counter);

      this.grid.addRow(this.gridFormGroup);
    } else {
      this.validationService.validateAllFormFields(this.priceRequestForm);
    }
  }

  /* * verify if the grid is in editing mode */
  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }


  async updateList(res) {
    this.gridFormGroup.controls[PurchaseRequestConstant.LABEL_ITEM].setValue(res[NumberConstant.ZERO].Code);
    this.gridFormGroup.controls[PurchaseRequestConstant.DESIGNATION].setValue(res[NumberConstant.ZERO].Description);
    if (this.isNew) {
      this.supplierList.push(res[NumberConstant.ZERO].IdTiersNavigation.Id);
    } else {
      Object.assign(
        this.supplierList.find((Id) => Id ===
          this.gridFormGroup.controls[PurchaseRequestConstant.ID_TIERS_NAVIGATION].value.Id),
        res[NumberConstant.ZERO].IdTiersNavigation.Id
      );
    }
    this.gridFormGroup.controls[PurchaseRequestConstant.ID_TIERS_NAVIGATION].setValue(res[NumberConstant.ZERO].IdTiersNavigation);
    this.gridFormGroup.controls[PurchaseRequestConstant.ID_TIERS].setValue(res[NumberConstant.ZERO].IdTiersNavigation.Id);
    await this.gridFormGroup;

  }


  /**
   * Select item
   */
  async itemSelect(event) {
    if (event) {
      if (event.itemFiltredDataSource && event.itemForm && event.itemForm.value.IdItem) {
        this.afterItemSelection(event.itemForm.value.IdItem);
      }
    }
  }

  private async afterItemSelection(itemValue) {
    this.errorItem = false;
    let predicateItem = new PredicateFormat();
    predicateItem.Filter = new Array<Filter>();
    predicateItem.Filter.push(new Filter(PriceRequestConstant.ID, Operation.eq, itemValue));
    predicateItem.Relation = new Array<Relation>();
    predicateItem.Relation.push.apply(predicateItem.Relation, [new Relation(PurchaseRequestConstant.ID_TIERS_NAVIGATION),
    new Relation(PurchaseRequestConstant.ID_NATURE_NAVIGATION), new Relation(PurchaseRequestConstant.ITEM_TIERS)]);
    await this.serviceItem.readPredicateData(predicateItem).toPromise().then(async res => {
      if(this.currentCompany.AllowRelationSupplierItems){
      this.serviceItem.GetItemTier(itemValue).subscribe(data => {
        this.itemtier = data.objectData.map(x => x.IdTiersNavigation)});
      }else {
        let predicateTier = new PredicateFormat();
        predicateTier.Filter = new Array<Filter>();
        predicateTier.Filter.push(new Filter(PriceRequestConstant.TYPE_TIER, Operation.eq, NumberConstant.TWO));
        this.serviceTiers.getSupplierDrodownList(predicateTier).subscribe(data => {
          this.itemtier = data.listData;
      });
    }
    this.contactDropDown.SetContact(this.gridFormGroup.controls[PurchaseRequestConstant.ID_TIERS].value);
      if (res[NumberConstant.ZERO].IdNatureNavigation.IsStockManaged && ((res[NumberConstant.ZERO].IsForSales && res[NumberConstant.ZERO].IdUnitSales == null) ||
        (res[NumberConstant.ZERO].IsForPurchase && res[NumberConstant.ZERO].IdUnitStock == null))) {
        this.growlService.ErrorNotification(this.translate.instant(PurchaseRequestConstant.ITEM_WITHOUT_MEASURE_UNIT));
        this.errorItem = true;
      }

    });
  }
  public removeLine({ isEdited, dataItem, rowIndex }) {
    this.grid.closeRow(this.editedRowIndex);
    this.removedRowIndex = rowIndex;
    this.gridFormGroup = createLineFormGroup(dataItem);
    this.gridFormGroup.controls[DocumentConstant.IS_DELETED].setValue(true);
    this.documentLineService.savePriceRequest(this.gridFormGroup.getRawValue(), false);
    this.view = this.documentLineService.priceRequest.filter(x => !x.IsDeleted);
    this.editedRowIndex = rowIndex;
    this.closeEditor();
  }

  selectedContact() {
    this.contactService.getById(this.gridFormGroup.controls[PurchaseRequestConstant.ID_CONTACT].value).toPromise().then(x => {
      this.gridFormGroup.controls['ContactString'].setValue(this.setContactIfNullField(x));
    });
  }

  private setContactIfNullField(data): string {
    if (data === null) {
      return '';
    }
    if (data.LastName === null) {
      data.LastName = '';
    }
    if (data.FirstName === null) {
      data.FirstName = '';
    }
    return data.LastName + ' ' + data.FirstName;
  }

  public getDataToUpdate(res) {
    for (let index = NumberConstant.ZERO; index < res.PriceRequestDetail.length; index++) {
      const element = res.PriceRequestDetail[index];
      element.LabelItem = element.IdItemNavigation.Code;
      element.Designation = element.IdItemNavigation.Description;
      element.IdLine = index;
      if (element.IdContactNavigation) {
        element.ContactString = this.setContactIfNullField(element.IdContactNavigation);
      }
      this.supplierList.push(element.IdTiersNavigation.Id);
    }
    this.documentLineService.priceRequest = res.PriceRequestDetail;
    this.view = this.documentLineService.priceRequestToAdd();
  }
  onTierChange(event) {
    if (event) {
      this.gridFormGroup.controls['IdTiersNavigation'].setValue(event);
      this.gridFormGroup.controls['IdTiers'].setValue(event.Id);
      this.contactDropDown.SetContact(this.gridFormGroup.controls[PurchaseRequestConstant.ID_TIERS].value);
    }
    else {
      this.gridFormGroup.controls['IdTiersNavigation'].setValue(null);
      this.gridFormGroup.controls['IdTiers'].setValue(null);
    }
  }

  ngOnInit() {
    this.haveAddSupplierPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SUPPLIER);
    this.haveUpdateSupplierPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER);
    this.getCompanyParams();
    }

  ngOnDestroy(): void {
   this.documentLineService.priceRequest = new Array<any>();
    this.documentLineService.counterPriceRequest = NumberConstant.ZERO;
    this.view = [];
    document.removeEventListener(SearchConstant.KEY_DOWN, this.keyAction, false);
  }
  public getCompanyParams() {
    this.serviceComany.getReducedDataOfCompany().subscribe( (x) => {
      this.currentCompany = x;
    });
  }

}
