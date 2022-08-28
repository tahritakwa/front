import {Component, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FormGroup, Validators, FormBuilder, FormControl, FormArray} from '@angular/forms';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FileInfo} from '../../../models/shared/objectToSend';
import {ValidationService, unique} from '../../../shared/services/validation/validation.service';
import {PricesService} from '../../services/prices/prices.service';
import {Router, ActivatedRoute} from '@angular/router';
import {PricesConstant} from '../../../constant/sales/prices.constant';
import {ObjectToSend} from '../../../models/sales/object-to-save.model';
import {Prices} from '../../../models/sales/prices.model';
import {PriceCustomersCardListComponent} from '../../components/price-customers-card-list/price-customers-card-list.component';
import {PriceItemsCardListComponent} from '../../components/price-items-card-list/price-items-card-list.component';
import {PriceQuantityDiscountListComponent} from '../../components/price-quantity-discount-list/price-quantity-discount-list.component';
import {PriceSpecialPriceDiscountListComponent} from '../../components/price-special-price-discount-list/price-special-price-discount-list.component';
import {PriceTotalPurchasesDiscountListComponent} from '../../components/price-total-purchases-discount-list/price-total-purchases-discount-list.component';
import {PriceGiftedItemsDiscountListComponent} from '../../components/price-gifted-items-discount-list/price-gifted-items-discount-list.component';
import {Observable} from 'rxjs/Observable';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TranslateService } from '@ngx-translate/core';

const ID = 'id';
const INVALID_CHILD_COMPONENT_CLASS = '.quantity-child-component input.ng-invalid'
@Component({
  selector: 'app-price-add',
  templateUrl: './price-add.component.html',
  styleUrls: ['./price-add.component.scss']
})
export class PriceAddComponent implements OnInit {


  @ViewChild('customersCardList') customersCardList: PriceCustomersCardListComponent;
  @ViewChild('itemsCardList') itemsCardList: PriceItemsCardListComponent;
  @ViewChild('quantityDiscountList') quantityDiscountList: PriceQuantityDiscountListComponent;
  @ViewChild('totalPurchasesDiscountList') totalPurchasesDiscountList: PriceTotalPurchasesDiscountListComponent;
  @ViewChild('specialPriceDiscountList') specialPriceDiscountList: PriceSpecialPriceDiscountListComponent;
  @ViewChild('giftedItemsDiscountList') giftedItemsDiscountList: PriceGiftedItemsDiscountListComponent;
  isUpdateMode = false;
  priceFormGroup: FormGroup;
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public ObservationsFilesToUpload: Array<FileInfo>;
  objectToSend: ObjectToSend;
  public attachmentURL: string;
  idPrice: number;
  PriceToUpdate: Prices;
  isAffectationDiscollapsed = false;
  isQuantityDiscountDiscollapsed = false;
  isTotalPurchasesDiscountDiscollapsed = false;
  isSpecialPriceDiscountDiscollapsed = false;
  isGiftedItemsDiscountDiscollapsed = false;
  private isSaveOperation = false;
  public urlList = PricesConstant.PRICES_LIST_URL;
  public idCurrency : number ;
  public disabledCurrency = false ;
  public hasAddPricePermission: boolean;
  public hasUpdatePricePermission: boolean;
  public currencyPrecesion ;
    constructor(private fb: FormBuilder, private validationService: ValidationService, private authService: AuthService, private translate: TranslateService,
              public pricesService: PricesService, private el: ElementRef,private styleConfigService: StyleConfigService,
              private router: Router, private activatedRoute: ActivatedRoute, public viewRef: ViewContainerRef) {
    this.ObservationsFilesToUpload = new Array<FileInfo>();
    this.activatedRoute.params.subscribe(params => {
      this.idPrice = +params[ID] || 0;
    });
  }

  ngOnInit() {
    this.hasAddPricePermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_PRICES);
    this.hasUpdatePricePermission =
    this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_PRICES);
    this.isUpdateMode = this.idPrice > 0;
    this.createAddForm();
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  private getDataToUpdate() {
    this.pricesService.getById(this.idPrice).subscribe(data => {
      this.PriceToUpdate = data;
      data.IdCurrency = data.IdUsedCurrency;
      this.currencyPrecesion = data.IdUsedCurrencyNavigation.Precision;
      this.disabledCurrency = true ;
      this.setPriceQuantityDiscountListOfDataToUpdate(this.PriceToUpdate);
      this.setPriceTotalPurchasesDiscountListOfDataToUpdate(this.PriceToUpdate);
      this.setPriceSpecialPriceDiscountListOfDataToUpdate(this.PriceToUpdate);
      this.setPriceGiftedItemsDiscountListOfDataToUpdate(this.PriceToUpdate);

      this.PriceToUpdate.PriceDetail = [];
      this.PriceToUpdate.PriceGiftedItemsDiscountList = [];
      this.PriceToUpdate.PriceQuantityDiscountList = [];
      this.PriceToUpdate.PriceSpecialPriceDiscountList = [];
      this.PriceToUpdate.PriceTotalPurchasesDiscountList = [];
      this.priceFormGroup.patchValue(this.PriceToUpdate);
      this.idCurrency = data.IdCurrency;
      this.ObservationsFilesToUpload = data.ObservationsFilesInfo;
      if (!this.hasUpdatePricePermission && !this.hasAddPricePermission) {
        this.priceFormGroup.disable();
      }
    });
  }

  public setPriceGiftedItemsDiscountListOfDataToUpdate(currentPrice: Prices) {
    if (currentPrice.PriceGiftedItemsDiscountList) {
      for (const currentPriceGiftedItemsDiscount of currentPrice.PriceGiftedItemsDiscountList) {
        this.priceDetailDateCorrections(currentPriceGiftedItemsDiscount);
        this.addCurrentPriceGiftedItemsDiscount(this.generatePriceDetailFormGroupFromPriceDetail(currentPriceGiftedItemsDiscount));
      }
    }
  }

  addCurrentPriceGiftedItemsDiscount(newDiscountFormGroup: FormGroup): void {
    this.PriceGiftedItemsDiscountList.push(newDiscountFormGroup);

  }

  public get PriceGiftedItemsDiscountList(): FormArray {
    return this.priceFormGroup.get(PricesConstant.PRICE_GIFTED_ITEMS_DISCOUNT_LIST) as FormArray;
  }

  public setPriceSpecialPriceDiscountListOfDataToUpdate(currentPrice: Prices) {
    if (currentPrice.PriceSpecialPriceDiscountList) {
      for (const currentPriceSpecialPriceDiscount of currentPrice.PriceSpecialPriceDiscountList) {
        this.priceDetailDateCorrections(currentPriceSpecialPriceDiscount);
        this.addCurrentPriceSpecialPriceDiscount(this.generatePriceDetailFormGroupFromPriceDetail(currentPriceSpecialPriceDiscount));
      }
    }
  }

  addCurrentPriceSpecialPriceDiscount(newDiscountFormGroup: FormGroup): void {
    this.PriceSpecialPriceDiscountList.push(newDiscountFormGroup);
  }

  public get PriceSpecialPriceDiscountList(): FormArray {
    return this.priceFormGroup.get(PricesConstant.PRICE_SPECIAL_PRICE_DISCOUNT_LIST) as FormArray;
  }

  public setPriceTotalPurchasesDiscountListOfDataToUpdate(currentPrice: Prices) {
    if (currentPrice.PriceTotalPurchasesDiscountList) {
      for (const currentPriceTotalPurchasesDiscount of currentPrice.PriceTotalPurchasesDiscountList) {
        this.priceDetailDateCorrections(currentPriceTotalPurchasesDiscount);
        this.addCurrentPriceTotalPurchasesDiscount(this.generatePriceDetailFormGroupFromPriceDetail(currentPriceTotalPurchasesDiscount));
      }
    }
  }

  addCurrentPriceTotalPurchasesDiscount(newDiscountFormGroup: FormGroup): void {
    this.PriceTotalPurchasesDiscountList.push(newDiscountFormGroup);

  }

  public get PriceTotalPurchasesDiscountList(): FormArray {
    return this.priceFormGroup.get(PricesConstant.PRICE_TOTAL_PURCHASES_DISCOUNT_LIST) as FormArray;
  }

  public setPriceQuantityDiscountListOfDataToUpdate(currentPrice: Prices) {
    if (currentPrice.PriceQuantityDiscountList) {
      for (const currentPriceQuantityDiscount of currentPrice.PriceQuantityDiscountList) {
        this.priceDetailDateCorrections(currentPriceQuantityDiscount);
        this.addCurrentPriceQuantityDiscount(this.generatePriceDetailFormGroupFromPriceDetail(currentPriceQuantityDiscount));
      }
    }
  }

  addCurrentPriceQuantityDiscount(newDiscountFormGroup: FormGroup): void {
    this.PriceQuantityDiscountList.push(newDiscountFormGroup);

  }

  public get PriceQuantityDiscountList(): FormArray {
    return this.priceFormGroup.get(PricesConstant.PRICE_QUANTITY_DISCOUNT_LIST) as FormArray;
  }

  priceDetailDateCorrections(priceDetail: any) {
    priceDetail.StartDateTime = priceDetail.StartDateTime ?
      new Date(priceDetail.StartDateTime) : priceDetail.StartDateTime;
    priceDetail.EndDateTime = priceDetail.EndDateTime ?
      new Date(priceDetail.EndDateTime) : priceDetail.EndDateTime;
  }

  public generatePriceDetailFormGroupFromPriceDetail(currentPriceDetail: any): FormGroup {
    return this.fb.group({
      Id: [currentPriceDetail.Id],
      StartDateTime: [currentPriceDetail.StartDateTime],
      EndDateTime: [currentPriceDetail.EndDateTime],
      Percentage: [currentPriceDetail.Percentage],
      ReducedValue: [currentPriceDetail.ReducedValue],
      SpecialPrice: [currentPriceDetail.SpecialPrice],
      MinimumQuantity: [currentPriceDetail.MinimumQuantity],
      MaximumQuantity: [currentPriceDetail.MaximumQuantity],
      TotalPrices: [currentPriceDetail.TotalPrices],
      SaledItemsNumber: [currentPriceDetail.SaledItemsNumber],
      GiftedItemsNumber: [currentPriceDetail.GiftedItemsNumber],
      TypeOfPriceDetail: [currentPriceDetail.TypeOfPriceDetail],
      IsDeleted: [currentPriceDetail.IsDeleted]
    });
  }

  private createAddForm(): void {
    this.priceFormGroup = this.fb.group({
      Id: [NumberConstant.ZERO],
      CodePrices: [{ value: '', disabled: this.isUpdateMode },
      {
        validators: Validators.required, asyncValidators: unique(PricesConstant.CodePrices, this.pricesService, String(this.idPrice)),
        updateOn: 'blur'
      }],
      LabelPrices: ['', [Validators.required]],
      ContractCode: [''],
      IdCurrency: ['', Validators.required],
      PriceQuantityDiscountList: this.fb.array([]),
      PriceTotalPurchasesDiscountList: this.fb.array([]),
      PriceSpecialPriceDiscountList: this.fb.array([]),
      PriceGiftedItemsDiscountList: this.fb.array([]),
    });
  }

  onClickAddPrice() {
    if (this.priceFormGroup.valid) {
      this.prepareObjectToSend();
      this.isSaveOperation = true;
      if (this.idPrice > PricesConstant.MIN_VALUE) {
        // Update Mode
        this.objectToSend.Model.Id = this.idPrice;
        this.pricesService.updatePrice(this.objectToSend).subscribe(() => {
          this.router.navigate([PricesConstant.PRICES_LIST_URL]);
        });
      } else {
        // Add Mode
        this.pricesService.savePrice(this.objectToSend).subscribe(() => {
          this.router.navigate([PricesConstant.PRICES_LIST_URL]);
        });
      }
    } else {
      this.validateAndOpenInValidCollapses();
      this.scrollToFirstInvalidControl();
    }
  }

  prepareObjectToSend() {
    const priceToSave = new Prices();
    Object.assign(priceToSave, this.PriceToUpdate);
    Object.assign(priceToSave, this.priceFormGroup.value);
    priceToSave.IdUsedCurrency = this.priceFormGroup.controls[PricesConstant.IdCurrency].value;
    priceToSave.ObservationsFilesInfo = this.ObservationsFilesToUpload;
    this.objectToSend = new ObjectToSend(priceToSave);
  }


  get IdItem(): FormControl {
    return this.priceFormGroup.get(PricesConstant.IdItem) as FormControl;
  }

  createPriceAndOpenCustomerAffectionModal() {
    if (this.priceFormGroup.valid) {
      if(this.priceFormGroup && this.priceFormGroup.controls['IdCurrency'] && this.priceFormGroup.controls['IdCurrency'].value ){
    this.idCurrency = this.priceFormGroup.controls['IdCurrency'].value;
      }
      this.prepareObjectToSend();
      this.pricesService.savePrice(this.objectToSend).subscribe((data) => {
        this.idPrice = data.Id;
        this.ngOnInit();
        this.customersCardList.openAffectionModal(this.idPrice, this.idCurrency);
      });

    } else {
      this.validateAndOpenInValidCollapses();
      this.scrollToFirstInvalidControl();
    }
  }

  validateAndOpenInValidCollapses() {
    if (this.PriceQuantityDiscountList.invalid) {
      this.isQuantityDiscountDiscollapsed = true;
    }
    if (this.PriceTotalPurchasesDiscountList.invalid) {
      this.isTotalPurchasesDiscountDiscollapsed = true;
    }
    if (this.PriceSpecialPriceDiscountList.invalid) {
      this.isSpecialPriceDiscountDiscollapsed = true;
    }
    if (this.PriceGiftedItemsDiscountList.invalid) {
      this.isGiftedItemsDiscountDiscollapsed = true;
    }
    this.validationService.validateAllFormFields(this.priceFormGroup);
  }

  createPriceAndOpenItemAffectionModal() {
    if (this.priceFormGroup.valid) {
      this.prepareObjectToSend();
      this.pricesService.savePrice(this.objectToSend).subscribe((data) => {
        this.idPrice = data.Id;
        this.ngOnInit();
        this.itemsCardList.openAffectionModal(this.idPrice);
      });

    } else {
      this.validateAndOpenInValidCollapses();
      this.scrollToFirstInvalidControl();
    }
  }

  quantityDiscountSelectedChange() {
    this.isQuantityDiscountDiscollapsed = !this.isQuantityDiscountDiscollapsed;
    if (this.isQuantityDiscountDiscollapsed) {
      this.quantityDiscountList.openCollapse();
    } else {
      this.quantityDiscountList.closeCollapse();
    }
  }

  totalPurchasesDiscountSelectedChange() {
    this.isTotalPurchasesDiscountDiscollapsed = !this.isTotalPurchasesDiscountDiscollapsed;
    if (this.isTotalPurchasesDiscountDiscollapsed) {
      this.totalPurchasesDiscountList.openCollapse();
    } else {
      this.totalPurchasesDiscountList.closeCollapse();
    }
  }

  specialPriceDiscountSelectedChange() {
    this.isSpecialPriceDiscountDiscollapsed = !this.isSpecialPriceDiscountDiscollapsed;
    if (this.isSpecialPriceDiscountDiscollapsed) {
      this.specialPriceDiscountList.openCollapse();
    } else {
      this.specialPriceDiscountList.closeCollapse();
    }
  }

  giftedItemsDiscountSelectedChange() {
    this.isGiftedItemsDiscountDiscollapsed = !this.isGiftedItemsDiscountDiscollapsed;
    if (this.isGiftedItemsDiscountDiscollapsed) {
      this.giftedItemsDiscountList.openCollapse();
    } else {
      this.giftedItemsDiscountList.closeCollapse();
    }
  }


  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormGroupChanged.bind(this));
  }

  private isFormGroupChanged(): boolean {
    return this.priceFormGroup.touched;
  }

  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(SharedConstant.FIRST_INVALID_ELEMENT);
    const quantityInvalidControl: HTMLElement = this.el.nativeElement.querySelector(INVALID_CHILD_COMPONENT_CLASS);
    if (quantityInvalidControl) {
      this.validationService.scrollToInvalidField(quantityInvalidControl);
    } else if (firstInvalidControl) {
      this.validationService.scrollToInvalidField(firstInvalidControl);
    }
   }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
  public selectedCurrency($event){
    if($event){
      this.currencyPrecesion = $event.Precision;
    }
    if(this.priceFormGroup && this.priceFormGroup.controls['IdCurrency'] && this.priceFormGroup.controls['IdCurrency'].value ){
    this.idCurrency = this.priceFormGroup.controls['IdCurrency'].value;
    }
    else{
      this.idCurrency = undefined;
    }
  }
  public CustomerListEmpty($event){
    if($event){
    this.disabledCurrency = false ;
    }else{
      this.disabledCurrency = true ;
    }
  }
}
