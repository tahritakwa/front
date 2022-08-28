import {
  Component,
  ComponentRef,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {Tiers} from '../../../models/achat/tiers.model';
import {TiersService} from '../../../purchase/services/tiers/tiers.service';
import {unique, ValidationService} from '../../services/validation/validation.service';
import {TiersConstants} from '../../../constant/purchase/tiers.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ComponentsConstant} from '../../../constant/shared/components.constant';
import {CurrencyService} from '../../../administration/services/currency/currency.service';
import {Account} from '../../../models/shared/account.model';
import {ModelOfItemComboBoxComponent} from '../model-of-item-combo-box/model-of-item-combo-box.component';
import {TranslateService} from '@ngx-translate/core';
import {Operation} from '../../../../COM/Models/operations';
import {Observable} from 'rxjs/Observable';
import {FileInfo} from '../../../models/shared/objectToSend';
import {TiersPictures} from '../../../models/achat/tiers-pictures.model';
import {RoleConfigConstant} from '../../../Structure/_roleConfigConstant';
import {ConfirmationModalComponent} from '../../modals/confirmation-modal/confirmation-modal.component';
import {ConfirmationModalSettings} from '../../modals/confirmation-modal-settings.model';
import {PhoneConstants} from '../../../constant/purchase/phone.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {EnumValues} from 'enum-values';
import {LeadSourcesEnum} from '../../../models/shared/enum/leadSources.enum';
import {ActivitySectorsEnum, ActivitySectorsEnumerator} from '../../../models/shared/enum/activitySectors.enum';
import {isNullOrEmptyString} from '@progress/kendo-angular-grid/dist/es2015/utils';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {ContactConstants} from '../../../constant/crm/contact.constant';
import {SwalWarring} from '../swal/swal-popup';
import {TiersAddressComponent} from '../tiers-address/tiers-address.component';
import {TiersContactComponent} from '../tiers-contact/tiers-contact.component';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TiersvehicleComponent } from '../tiers-vehicle/tiers-vehicle.component';
import { TierCategory } from '../../../models/sales/tier-category.model';
import { switchMap } from 'rxjs/operators';


const ACTIVITY_SECTOR_REFERENCE = 'activitySectorReference';
const LEAD_SOURCE_REFERENCE = 'leadSourceReference';
const CATEGORY_TIER_REFERENCE = 'categoryTierReference';

@Component({
  selector: 'app-add-tiers',
  templateUrl: './add-tiers.component.html',
  styleUrls: ['./add-tiers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddTiersComponent implements OnInit, OnDestroy, IModalDialog {
  @ViewChild(ModelOfItemComboBoxComponent) modelOfItemChild;
  @ViewChild(ConfirmationModalComponent) public confirmationModal: ConfirmationModalComponent;
  /**
   * Decorator to identify the activity sector  template reference
   */
  @ViewChild(ACTIVITY_SECTOR_REFERENCE) public activitySectorComboBox: ComboBoxComponent;
  /**
   * Decorator to identify the lead source  template reference
   */
  @ViewChild(LEAD_SOURCE_REFERENCE) public leadSourceComboBox: ComboBoxComponent;
  /**
   * Decorator to identify the lead source  template reference
   */
   @ViewChild(CATEGORY_TIER_REFERENCE) public categoryTierReference: ComboBoxComponent;
  confirmationModalSetting: ConfirmationModalSettings;
  public tiersListURL;
  public currency;
  /**
   * tiersTypeInput
   */
  @Input() tiersTypeInput;
  /**
   *childComps
   */
  @ViewChildren(TiersConstants.CONTACT_C_LOW, {read: ElementRef})
  childComps: QueryList<ElementRef>;
  /**
   *viewContainer
   */
  @ViewChild(TiersConstants.V_CONTACT_V_LOW, {read: ViewContainerRef})
  viewContainer: ViewContainerRef;
  /**
   * Template
   */
  @ViewChild(TemplateRef)
  template: TemplateRef<null>;
  /**
   * Form Group
   */
  tiersFormGroup: FormGroup;
  /**
   * form controle
   */
  @Input() control: FormControl;

  /**
   * Id Entity
   */
  public id: number;
  /**
   * id Subscription
   */
  private idSubscription: Subscription;
  private tierSubscription: Subscription;
  /**
   * is updateMode
   */
  public isUpdateMode: boolean;
  /**
   * If modal=true
   */
  @Input() isModal: boolean;
  /*
   * Tiers to update
   */
  public tiersToUpdate: Tiers = this.activatedRoute.snapshot.data['tiersToUpdate'];
  /**
   * dialog subject
   */
  options: Partial<IModalDialogOptions<any>>;
  /**
   * tiers type 1:Customer, 2: Supplier
   */
  tiersType: number;
  formatSaleOptions: any;
  public genderList: Array<any> = [
    {text: this.translate.instant('CLIENT'), value: 1},
    {text: this.translate.instant('supplier'), value: 2}
  ];
  // selectd value in the switch button to whoose if the tier is Customer or Supplier
  tierSelectedType: boolean;
  tiersAccounts = [];

  @Input() inputOptions: Partial<IModalDialogOptions<any>>;

  public defaultPhoneCountryTn = PhoneConstants.DEFAULT_COUNTRY_TN;
  public defaultPhoneCountryFr = PhoneConstants.DEFAULT_COUNTRY_FR;
  public defaultPhoneCountryGb = PhoneConstants.DEFAULT_COUNTRY_GB;
  /**
   * flag country phone
   */
  public isTiersHasPhone = false;

  /*
  Collapse informations
   */
  public openTiersDetailsCollapse = false;
  public openAddressDetailsCollapse = false;
  public openFinancialInformationsCollapse = false;
  public openTiersContactsCollapse = false;
  public openTiersVehicleCollapse = false;


  public categoryTierFiltredSource: TierCategory[] = [];
  public categoryTierSource: TierCategory[] = [];

  public categoryTier = [];
  public categoryTierFiltred = [];
  public activitySectors = [];
  public activitySectorsFiltred = [];
  public leadSources = [];
  public leadSourcesFiltred = [];
  public collapseAddressOpened = false;
  public collapseContactOpened = false;
  public collapseVehicleOpened = false;

  public contactLabel = this.translate.instant(TiersConstants.MANAGER);
  public contactLabelEditable: boolean[] = [];
  public tiersAddress = [];
  public tiersContact = [];
  public tiersVehicle = [];

  /**
   *changeSupplierState
   * @param tiersService
   * @param fb
   * @param router
   * @param activatedRoute
   * @param modalService
   * @param validationService
   * @param growlService
   * @param translate
   */
  dataToSendToAccounting = {
    id: null,
    relationEntityId: null,
    accountId: null
  };
  hasAccount = false;
  public tiersPictures: TiersPictures;
  public attachmentFilesToUpload: FileInfo;
  public emptyAttachmentFilesToUpload: Array<string> = ['assets/image/placeholder-logo.png'];
  pictureFileInfo: FileInfo;
  public pictureTierSrc: any;
  UrlPicture: string;
  defaultPictureUrl = 'assets/image/placeholder-logo.png';
  public isSaveOperation = false;
  /**
   * default dial code
   */
  public dialCode: string[] = [PhoneConstants.DEFAULT_DIAL_CODE_COUNTRY_TN];
  /*
 default country code
  */
  public countryCode: string[] = [PhoneConstants.DEFAULT_COUNTRY_TN];
  public tiersHasPhone = false;
  public tiersPhoneHasError = false;
  public contactPhoneHasError = false;
  public account: Account;
  public RoleConfigConstant = RoleConfigConstant;
  public haveCeillling = false;
  public checkTaxRegistrationUnicity: boolean = true;

  public hasAddCustomerPermission = false;
  public hasUpdateCustomerPermission = false;
  public hasCustomerListPermission = false;
  public hasShowAccountPermission = false;

  public haveAddSupplierPermission= false;
  public haveUpdateSupplierPermission = false;
  public hasSupplierListPermission = false;
  @Input() formGroup: FormGroup;
  /**
   *
   * @param tiersService
   * @param fb
   * @param router
   * @param activatedRoute
   * @param modalService
   * @param validationService
   * @param currencyService
   * @param permissionsService
   * @param translate
   * @param el
   * @param growlService
   * @param swalWarring
   * @param injector
   */
  constructor(public tiersService: TiersService, private fb: FormBuilder, private router: Router,
              private activatedRoute: ActivatedRoute, private modalService: ModalDialogInstanceService,
              public validationService: ValidationService, public currencyService: CurrencyService,
              private translate: TranslateService, private el: ElementRef,private growlService: GrowlService,
      private swalWarring: SwalWarring, private injector: Injector, public authService: AuthService) {
    this.tiersToUpdate = new Tiers();
    this.idSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = +params[TiersConstants.PARAM_ID] || 0;
    });
    this.isModal = false;
    this.attachmentFilesToUpload = new FileInfo();
    this.tiersTypeInput = this.activatedRoute.snapshot.data['supplierTypeId'];
    if (this.id !== NumberConstant.ZERO) {
      this.tiersToUpdate = this.activatedRoute.snapshot.data['tiersToUpdate'];
    }
  }

  /**
   * oninit
   */
  ngOnInit() {
    this.hasAddCustomerPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_CUSTOMER);
    this.hasUpdateCustomerPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CUSTOMER);
    this.hasCustomerListPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_CUSTOMER);
    this.hasSupplierListPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_SUPPLIER);
    this.hasShowAccountPermission = this.authService.hasAuthority(
      PermissionConstant.SettingsAccountingPermissions.VIEW_ACCOUNTING_ACCOUNTS
    );
    this.haveAddSupplierPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_SUPPLIER);
    this.haveUpdateSupplierPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_SUPPLIER);
    if (this.inputOptions && this.isModal) {
      this.dialogInit(null, this.inputOptions);
    } else {
      if (this.tiersTypeInput) {
        this.tiersType = this.tiersTypeInput;
      } else if (this.tiersType) {
        this.tiersTypeInput = this.tiersType;
      }
      this.tiersListURL = (this.tiersType === TiersConstants.CUSTOMER_TYPE) ? TiersConstants.CUSTOMER_LIST_URL
        : TiersConstants.SUPPLIERS_LIST_URL;
      this.createAddForm();
      this.isUpdateMode = this.id > 0 && !this.isModal;
      if (this.isUpdateMode && this.tiersType) {
        this.getDataToUpdate();
      }
      this.tiersService.show(this.isUpdateMode);
    }
    if (this.tiersType) {
      this.tiersFormGroup.controls['IdTypeTiers'].setValue(this.tiersType);
      this.tiersFormGroup.controls['IdTypeTiers'].disable();
    }
    this.initLeadSources();
    this.initActivitySectors();
  }


  /**
   * on destroy
   */
  ngOnDestroy(): void {
    if (this.idSubscription !== undefined) {
      this.idSubscription.unsubscribe();
    }
    if (this.tierSubscription !== undefined) {
      this.tierSubscription.unsubscribe();
    }
  }


  /**
   * mode modal init
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    let idTypeTiersData = 0;
    let idTiersData = 0;

    if (options.data) {
      if (options.data.isFromCard) {
        idTypeTiersData = options.data.IdTypeTiers;
        idTiersData = options.data.Id;
      } else {
        idTypeTiersData = options.data.Type;
        idTiersData = options.data.id;
      }
    }


    if (!idTypeTiersData) {
      if (options.data) {
        this.tiersType = +options.data;
      }
    } else {
      this.tiersType = +idTypeTiersData;
      this.tiersToUpdate = new Tiers();
      if (options.data) {
        this.tiersToUpdate.Name = options.data.Name;
      }
      this.createAddForm();
      if (idTiersData) {
        this.id = idTiersData;
        this.isUpdateMode = this.id > 0;
        this.getDataToUpdate();
        this.tiersFormGroup.patchValue(this.tiersToUpdate);
        if (options.data && !options.data.isFromCard) {
          this.tiersFormGroup.disable();
        }
      } else {
        this.tiersFormGroup.patchValue(this.tiersToUpdate);
      }
    }
  }


  /**
   * get item to update then generate contact form and init form value
   */
  private getDataToUpdate() {
    this.dataToSendToAccounting.relationEntityId = this.id;
    this.tiersToUpdate.IdAccountingAccountTiers = null;
    if (this.tiersToUpdate && this.tiersToUpdate.AuthorizedAmountInvoice) {
      this.haveCeillling = true;
      this.AuthorizedAmountInvoice.setValidators([Validators.required, Validators.min(NumberConstant.ZERO)]);
    } else {
      this.haveCeillling = false;
      this.AuthorizedAmountInvoice.setValidators(Validators.min(NumberConstant.ZERO));
    }
    if (this.hasShowAccountPermission) {
      this.getAccountAllocatedToTier().subscribe((allocatedAccount) => {
        this.hasAccount = true;
        this.dataToSendToAccounting.accountId = allocatedAccount.account.id;
        this.dataToSendToAccounting.id = allocatedAccount.id;
        this.tiersToUpdate.IdAccountingAccountTiers = allocatedAccount.account.id;
        this.tiersFormGroup.controls['IdAccountingAccountTiers'].setValue(allocatedAccount.account.id);
      });
    }
    this.getSelectedCurrency(this.tiersToUpdate.IdCurrencyNavigation);
    if (this.tiersToUpdate[ComponentsConstant.IdTaxeGroupTiers] !== null) {

      this.receiveTaxeGroupTiers(this.tiersToUpdate[ComponentsConstant.IdTaxeGroupTiers]);
    }
    if (this.tiersToUpdate.UrlPicture) {
      this.tiersService.getPicture(this.tiersToUpdate.UrlPicture).subscribe((res: any) => {
        this.pictureTierSrc = SharedConstant.PICTURE_BASE + res;
      });
    }
    this.tiersToUpdate.IdPhoneNavigation = this.tiersToUpdate.IdPhoneNavigation ?
      this.tiersToUpdate.IdPhoneNavigation : '';
    this.tiersFormGroup.patchValue(this.tiersToUpdate);
    this.checkCollapsesOnUpdate();
  }

  private buildIdPhoneNavigation() {
    return this.fb.group({
      Id: [NumberConstant.ZERO],
      Number: [],
      DialCode: [this.dialCode[NumberConstant.ZERO]],
      CountryCode: [this.countryCode[NumberConstant.ZERO]],
      IsDeleted: [false]
    });
  }

  receiveAccounts($event) {
    if (this.modelOfItemChild) {
      this.modelOfItemChild.initDataSource($event);
    }
  }

  getAccountAllocatedToTier(): Observable<any> {
    const dynamicImportAccountService = require('../../../accounting/services/account/account.service');
    const dynamicImportAccountConstant = require('../../../constant/accounting/account.constant');
    const dynamicImportAccountRelationTypeEnum = require('../../../models/accounting/account-relation-type');
    let accountRelationType;
    if (this.tiersType === TiersConstants.SUPPLIER_TYPE) {
      accountRelationType = dynamicImportAccountRelationTypeEnum.AccountRelationType.SUPPLIER;
    } else {
      accountRelationType = dynamicImportAccountRelationTypeEnum.AccountRelationType.CUSTOMER;
    }
    return this.injector.get(dynamicImportAccountService.AccountService)
      .getJavaGenericService().callService(Operation.GET, `${dynamicImportAccountConstant.AccountsConstant.ACCOUNT_RELATION_URL}/${accountRelationType}?id=${this.dataToSendToAccounting.relationEntityId}`);
  }

  /**
   * create main form
   */
  private createAddForm(): void {
    this.tiersFormGroup = this.fb.group({
      Id: [0],
      CodeTiers: [{value: '', disabled: true}],
      Name: ['', [Validators.required, Validators.minLength(TiersConstants.NAME_MIN_LENGTH),
        Validators.maxLength(TiersConstants.NAME_MAX_LENGTH)]],
      MatriculeFiscale: ['',
        Validators.maxLength(TiersConstants.MAX_LENGTH_TAX_REGISTRATION_NUMBER)],
      CIN: ['', {
        asyncValidators: unique('Cin', this.tiersService, this.id ?
          String(this.id) : String(NumberConstant.ZERO)), updateOn: 'blur'
      }],
      Description: [''],
      Address: this.fb.array([]),
      IdSalesPrice: [''],
      IdCurrency: ['', [Validators.required]],
      IdTaxeGroupTiers: ['', Validators.required],
      IdTypeTiers: ['', Validators.required],
      AuthorizedAmountInvoice: [undefined, Validators.min(NumberConstant.ZERO)],
      ProvisionalAuthorizedAmountDelivery: ['', Validators.min(NumberConstant.ZERO)],
      DeleveryDelay: ['', [
        Validators.min(NumberConstant.ZERO),
        Validators.max(NumberConstant.YEAR_DAYS)
      ]],
      PaymentDelay: ['', [
        Validators.pattern('^[0-9]*$'),
        Validators.min(NumberConstant.ZERO),
        Validators.max(NumberConstant.YEAR_DAYS)
      ]],
      IdSettlementMode: [''],
      IdDeliveryType: [''],
      Contact: this.fb.array([]),
      Vehicle: this.fb.array([]),
      IdAccountingAccountTiers: [''],
      ActivitySector: [''],
      LeadSource: [''],
      Email: ['', {
        validators: [Validators.pattern(SharedConstant.MAIL_PATTERN)],
        asyncValidators: unique(TiersConstants.EMAIL, this.tiersService, String(this.id)), updateOn: 'blur'
      }],
      IdPhone: [NumberConstant.ZERO],
      IdPhoneNavigation: this.buildIdPhoneNavigation(),
      Fax: [''],
      Linkedin: [''],
      Facebook: [''],
      Twitter: [''],
      WasLead: ['false'],
      CreationDate: [''],
      UpdatedDate: [''],
      IsSynchronizedBToB:[false],
      IdTierCategory: ['']
    });
  }

  /**
   * On change taxe group tiers, receive the selected value
   * */
  receiveTaxeGroupTiers($event) {
    this.tiersFormGroup.controls['IdTaxeGroupTiers'].setValue($event);
    if (this.modelOfItemChild) {
      this.modelOfItemChild.initDataSource($event);
    }
  }

  /**
   * delete contact
   * @param i
   */
  deleteContact(i: number): void {
    this.removeControlsOfRemovedContactForm(i);
    this.contactLabelEditable.slice(i, NumberConstant.ONE);
    if (this.isUpdateMode) {
      if (this.Contact.at(i).get(TiersConstants.ATTRIBUT_ID).value === 0) {
        this.Contact.removeAt(i);
      } else {
        this.Contact.at(i).get(TiersConstants.IS_DELETED).setValue(true);
      }
    } else {
      this.Contact.removeAt(i);
    }
  }


  removeControlsOfRemovedContactForm(index): void {
    (<FormGroup>(this.Contact.controls[index])).controls['FirstName'].setErrors(null);
    (<FormGroup>(this.Contact.controls[index])).controls['LastName'].setErrors(null);
    (<FormGroup>(this.Contact.controls[index])).controls['Tel1'].setErrors(null);
    (<FormGroup>(this.Contact.controls[index])).controls['Email'].setErrors(null);
  }


  /**
   * show/hide contact
   * @param i
   */
  isContactRowVisible(i): boolean {
    return !this.Contact.at(i).get(TiersConstants.IS_DELETED).value;
  }


  /**
   * get Contact form
   */
  get Contact(): FormArray {
    return this.tiersFormGroup.get(TiersConstants.CONTACT) as FormArray;
  }


  public saveTiers(data: Tiers) {
    this.tiersService.saveTiers(data, !this.isUpdateMode).subscribe(() => {
      if (!this.isModal) {
        if (this.tiersType === TiersConstants.CUSTOMER_TYPE) {
          this.router.navigate([TiersConstants.CUSTOMER_LIST_URL]);
        } else {
          this.router.navigate([TiersConstants.SUPPLIERS_LIST_URL]);
        }
      } else {
        this.options.onClose();
        this.modalService.closeAnyExistingModalDialog();
      }
    });
  }


  /**
   * Save click
   */
  public onAddTiersClick(): void {
    this.checkCollapseAddressOnCloseValidation();
    this.checkCollapseContactOnCloseValidation();
    this.checkCollapseVehicleOnCloseValidation();
    if (this.tiersFormGroup.valid && !this.tiersPhoneHasError && !this.contactPhoneHasError) {
      this.isSaveOperation = true;
      const tiersToSave = this.tiersFormGroup.getRawValue() as Tiers;
      this.checkIdPhoneNavigation(tiersToSave);
      this.prepareAuthorizedAmountInvoice(tiersToSave);
      this.prepareProvisionalAuthorizedAmountDelivery(tiersToSave);
      this.prepareTiersPicture(tiersToSave);
      this.dataToSendToAccounting.accountId = this.tiersFormGroup.getRawValue().IdAccountingAccountTiers;
      if (this.isUpdateMode) {
        this.dataToSendToAccounting.relationEntityId = tiersToSave.Id;
        if(tiersToSave.PictureFileInfo != undefined && tiersToSave.PictureFileInfo.Data != undefined){
          tiersToSave.PictureFileInfo.FileData = tiersToSave.PictureFileInfo.Data.toString();
        }
        if(!this.pictureFileInfo){
          tiersToSave.UrlPicture = this.tiersToUpdate.UrlPicture;
        }
      }
      if (this.hasShowAccountPermission) {
        this.tiersService
          .saveTiers(tiersToSave, !this.isUpdateMode)
          .pipe(
            switchMap((data) => {
              if (data) {
                if (data.hasOwnProperty("Id")) {
                  this.dataToSendToAccounting.relationEntityId = data.Id;
                } else {
                  this.dataToSendToAccounting.relationEntityId = this.id;
                }
              }
              if (this.dataToSendToAccounting.accountId) {
                return this.allocateTierToAccountingAccount(
                  this.dataToSendToAccounting
                );
              } else if (this.hasAccount) {
                return this.removeAllocatedTierFromAccountingAccount(
                  this.dataToSendToAccounting.relationEntityId
                );
              }
            })
          )
          .subscribe();
      } else {
        this.tiersService
          .saveTiers(tiersToSave, !this.isUpdateMode)
          .subscribe();
      }

      if (!this.isModal) {
        this.navigateToList();
      } else {
        this.closeModal();
      }
    } else {
      this.validationService.validateAllFormFields(this.tiersFormGroup);
      /*if(this.checkTaxRegistrationUnicity && this.tiersFormGroup.controls['MatriculeFiscale'].value.length > 0){
        this.tiersFormGroup.controls['MatriculeFiscale'].setErrors({'incorrect': true});
      }else if(!this.checkTaxRegistrationUnicity && this.tiersFormGroup.controls['MatriculeFiscale'].value.length > 0){
        this.tiersFormGroup.controls['MatriculeFiscale'].setErrors(null);
      }*/
      this.checkCollapsesOpening();
      this.checkInvalidFields();
      /*if(this.checkTaxRegistrationUnicity && this.tiersFormGroup.controls['MatriculeFiscale'].value.length > 0){
        this.tiersFormGroup.controls['MatriculeFiscale'].setErrors({'incorrect': true});
      }else if(!this.checkTaxRegistrationUnicity && this.tiersFormGroup.controls['MatriculeFiscale'].value.length > 0){
        this.tiersFormGroup.controls['MatriculeFiscale'].setErrors({'incorrect': false});
      }*/
    }
  }

  private closeModal() {
    if (this.options.data.Type || this.options.data.IdTypeTiers) {
      this.options.data.Name = this.tiersFormGroup.controls.Name.value;
      this.options.onClose();
      this.modalService.closeAnyExistingModalDialog();
    }
  }

  private navigateToList() {
    if (this.tiersType === TiersConstants.CUSTOMER_TYPE) {
      if (this.hasCustomerListPermission) {
        this.router.navigate([TiersConstants.CUSTOMER_LIST_URL]);
      }
    } else {
      this.router.navigate([TiersConstants.SUPPLIERS_LIST_URL]);
    }
  }

  private prepareTiersPicture(tiersToSave: Tiers) {
    if (this.pictureFileInfo) {
      tiersToSave.PictureFileInfo = this.pictureFileInfo;
    }
  }

  private prepareAuthorizedAmountInvoice(tiersToSave: Tiers) {
    if (this.tiersType === TiersConstants.CUSTOMER_TYPE && tiersToSave.AuthorizedAmountInvoice !== null
      && tiersToSave.AuthorizedAmountInvoice !== undefined) {
      if(this.haveCeillling){
        tiersToSave.AuthorizedAmountInvoice = Number(
          tiersToSave.AuthorizedAmountInvoice.toFixed(this.formatSaleOptions.minimumFractionDigits));
      }else{
        tiersToSave.AuthorizedAmountInvoice = undefined;
      }
    }
  }

  private prepareProvisionalAuthorizedAmountDelivery(tiersToSave: Tiers) {
    if (this.tiersType === TiersConstants.CUSTOMER_TYPE && tiersToSave.ProvisionalAuthorizedAmountDelivery !== null
      && Number(tiersToSave.ProvisionalAuthorizedAmountDelivery)) {
      if(this.haveCeillling){
        tiersToSave.ProvisionalAuthorizedAmountDelivery = Number(
          tiersToSave.ProvisionalAuthorizedAmountDelivery.toFixed(this.formatSaleOptions.minimumFractionDigits));
      }else{
        tiersToSave.ProvisionalAuthorizedAmountDelivery = undefined;
      }
    }
  }

  /**
   * remove empty vehicle formGroup from formArray on close collapse vehicle
   */
  private checkCollapseVehicleOnCloseValidation() {
    const vehicleFormArray = this.tiersFormGroup.controls.Vehicle as FormArray;
    if (vehicleFormArray.value.length > 0 && !vehicleFormArray.valid) {
      this.openTiersVehicleCollapse = true;
    }
  }

  /**
   * remove empty address formGroup from formArray on close collapse address
   */
  private checkCollapseAddressOnCloseValidation() {
    const addressFormArray = this.tiersFormGroup.controls.Address as FormArray;
    if (addressFormArray.value.length > 0 && !addressFormArray.valid) {
      this.openAddressDetailsCollapse = true;
    }
  }

  /**
   * remove empty contact formGroup from formArray on close collapse contact
   */
   private checkCollapseContactOnCloseValidation() {
    const contactFormArray = this.tiersFormGroup.controls.Contact as FormArray;
    if (contactFormArray.value.length > 0 && !contactFormArray.valid) {
      this.openTiersContactsCollapse = true;
    }
  }


  allocateTierToAccountingAccount(dataToSendToAccounting) {
    const dynamicImportAccountService = require('../../../accounting/services/account/account.service');
    const dynamicImportAccountConstant = require('../../../constant/accounting/account.constant');
    const dynamicImportAccountRelationTypeEnum = require('../../../models/accounting/account-relation-type');
    let accountRelationType;
    if (this.tiersType === TiersConstants.SUPPLIER_TYPE) {
      accountRelationType = dynamicImportAccountRelationTypeEnum.AccountRelationType.SUPPLIER;
    } else {
      accountRelationType = dynamicImportAccountRelationTypeEnum.AccountRelationType.CUSTOMER;
    }
    return(this.injector.get(dynamicImportAccountService.AccountService)
      .getJavaGenericService().callService(Operation.POST, `${dynamicImportAccountConstant.AccountsConstant.ACCOUNT_RELATION_URL}/${accountRelationType}`, dataToSendToAccounting));
  
  }

  removeAllocatedTierFromAccountingAccount(tiersId) {
    const dynamicImportAccountService = require('../../../accounting/services/account/account.service');
    const dynamicImportAccountConstant = require('../../../constant/accounting/account.constant');
    const dynamicImportAccountRelationTypeEnum = require('../../../models/accounting/account-relation-type');
    let accountRelationType;
    if (this.tiersType === TiersConstants.SUPPLIER_TYPE) {
      accountRelationType = dynamicImportAccountRelationTypeEnum.AccountRelationType.SUPPLIER;
    } else {
      accountRelationType = dynamicImportAccountRelationTypeEnum.AccountRelationType.CUSTOMER;
    }
    return(this.injector.get(dynamicImportAccountService.AccountService)
      .getJavaGenericService().deleteEntity(tiersId, `${dynamicImportAccountConstant.AccountsConstant.ACCOUNT_RELATION_URL}/${accountRelationType}`));
  }

  /**get tiers Currency symbol */
  getSelectedCurrency(currency) {
    if (currency) {
        this.formatSaleOptions = {
          idCurrency: currency.Id,
          style: 'currency',
          currency: currency.Code,
          currencyDisplay: 'symbol',
          minimumFractionDigits: currency.Precision
        };
        this.tiersFormGroup.controls['IdCurrency'].setValue(this.formatSaleOptions.idCurrency);
    }

  }

  // this method exist only when the tiersType is not set ;
  // the method will be executed when the use choose a tiers type
  changeSupplierState() {
    this.tiersType = this.tiersFormGroup.controls['IdTypeTiers'].value;
  }


  private initLeadSources() {
    this.leadSources = EnumValues.getNames(LeadSourcesEnum).map(
      source => {
        return {enumValue: source, enumText: this.translate.instant(source)};
      });
    this.leadSourcesFiltred = this.leadSources;
  }



  private initActivitySectors() {
    const activitysSectors = EnumValues.getNames(ActivitySectorsEnum);
    this.activitySectors = activitysSectors.map((activitySectors: any) => {
      return activitySectors = {enumValue: activitySectors, enumText: this.translate.instant(activitySectors)};
    });
    this.activitySectors = this.activitySectors.filter(x => x.enumValue != ActivitySectorsEnumerator.Payment_Institution);
    this.activitySectorsFiltred = this.activitySectors;
  }


  public checkCollapsesOpening() {
    for (const control in this.tiersFormGroup.controls) {
      if (control) {
        const collapseNumber = this.getElementCollapseNumber(control);
        if (collapseNumber === NumberConstant.ONE
          && this.openTiersDetailsCollapse === false
          && !this.tiersFormGroup.controls[control].valid
          && this.tiersFormGroup.controls[control].value !== '') {
          this.openTiersDetailsCollapse = true;
        } else if (collapseNumber === NumberConstant.TWO
          && this.openAddressDetailsCollapse === false
          && this.tiersFormGroup.controls[control].invalid) {
          this.openAddressDetailsCollapse = true;
        } else if (collapseNumber === NumberConstant.THREE
          && this.openFinancialInformationsCollapse === false
          && this.tiersFormGroup.controls[control].invalid) {
          this.openFinancialInformationsCollapse = true;
        } else if (collapseNumber === NumberConstant.FOUR
          && this.openTiersContactsCollapse === false
          && this.tiersFormGroup.controls[control].invalid) {
          this.openTiersContactsCollapse = true;
        }
      }
    }
  }

  /**
   *
   * @param control
   */
  public getElementCollapseNumber(control): number {
    if (control === TiersConstants.EMAIL || control === TiersConstants.PHONE_NAVIGATION || control === TiersConstants.FAX
      || control === TiersConstants.LINKEDIN || control === TiersConstants.FACEBOOK || control === TiersConstants.TWITTER) {
      return NumberConstant.ONE;
    } else if (control === TiersConstants.ADDRESSES_FORM) {
      return NumberConstant.TWO;
    } else if (control === TiersConstants.AUTHORIZED_AMOUNT_INVOICE || control === TiersConstants.PROVISIONAL_AUTHORIZED_AMOUNT_DELIVERY
      || control === TiersConstants.ID_TAXE_GROUP) {
      return NumberConstant.THREE;
    } else if (control === TiersConstants.CONTACT) {
      return NumberConstant.FOUR;
    }
  }

  public checkCeillingClick() {
    this.haveCeillling = !this.haveCeillling;
    if (this.haveCeillling) {
      this.AuthorizedAmountInvoice.setValidators([Validators.required, Validators.min(NumberConstant.ZERO)]);
    } else {
      this.AuthorizedAmountInvoice.setValidators(Validators.min(NumberConstant.ZERO));
    }
  }

  public handleFiltreActivitySectors(value) {
    this.activitySectors = this.activitySectorsFiltred.filter(o => o.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  public handleFiltreLeadSource(value) {
    this.leadSources = this.leadSourcesFiltred.filter(o => o.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }


  public openAddressDetailCollapse() {
    if (this.Address.value.length === NumberConstant.ZERO) {
      this.collapseAddressOpened = true;
    }
    if (!this.openAddressDetailsCollapse) {
      this.collapseAddressOpened = false;
      this.Address.controls = this.Address.controls
        .filter(adress => !TiersAddressComponent.isEmptyAdressFields(adress.value));
    }
  }

  get Address(): FormArray {
    return this.tiersFormGroup.get(TiersConstants.ADDRESS) as FormArray;
  }

  get Vehicle(): FormArray {
    return this.tiersFormGroup.get(TiersConstants.VEHICLE) as FormArray;
  }

  public openContactDetailCollapse() {
    if (this.tiersFormGroup.value.Contact.length === NumberConstant.ZERO) {
      this.collapseContactOpened = true;
    }
    if (!this.openTiersContactsCollapse) {
      this.collapseContactOpened = false;
      this.Contact.controls = this.Contact.controls
        .filter(contact => !TiersContactComponent.isEmptyContactFields(contact.value));
    }
  }

  public openVehicleDetailCollapse() {
    if (this.tiersFormGroup.value.Vehicle.length === NumberConstant.ZERO) {
      this.collapseVehicleOpened = true;
    }
    if (!this.openTiersVehicleCollapse) {
      this.collapseVehicleOpened = false;
      this.Vehicle.controls = this.Vehicle.controls
        .filter(Vehicle => !TiersvehicleComponent.isEmptyVehicleFields(Vehicle.value));
    }
  }


  /**
   *
   * @param event
   */
  uploadPicture(event) {
    const file = event.target.files[NumberConstant.ZERO];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      if(file.type.startsWith("image/")){
        reader.onload = () => {
          this.pictureFileInfo = new FileInfo();
          this.pictureFileInfo.Name = file.name;
          this.pictureFileInfo.Extension = file.type;
          this.pictureFileInfo.FileData = (<string>reader.result).split(',')[1];
          this.pictureTierSrc = reader.result;
        };
      }
    }
  }

  /**
   * method to check the collapse state opened||closed
   * @private
   */
  private checkCollapsesOnUpdate() {
    this.checkCollapseAddressStateOnUpdate();
    this.checkCollapseContactStateOnUpdate();
    this.checkCollapseDetailsStateOnUpdate();
    this.checkCollapseVehicleStateOnUpdate()
  }

  private checkCollapseDetailsStateOnUpdate() {
    if (!isNullOrEmptyString(this.Email.value) || !isNullOrEmptyString(this.Facebook.value) ||
      !isNullOrEmptyString(this.IdPhone.value) || !isNullOrEmptyString(this.Fax.value) ||
      !isNullOrEmptyString(this.Linkdln.value) || !isNullOrEmptyString(this.Twitter.value)) {
      this.openTiersDetailsCollapse = true;
    }
  }

  private checkCollapseContactStateOnUpdate() {
    if (this.tiersToUpdate.Contact.length > NumberConstant.ZERO) {
      this.openTiersContactsCollapse = true;
      this.tiersContact = this.tiersToUpdate.Contact;
    }
  }
  private checkCollapseVehicleStateOnUpdate() {
    if (this.tiersToUpdate.Vehicle.length > NumberConstant.ZERO) {
      this.openTiersVehicleCollapse = true;
      this.tiersVehicle = this.tiersToUpdate.Vehicle;
    }
  }


  private checkCollapseAddressStateOnUpdate() {
    if (this.tiersToUpdate.Address.length > NumberConstant.ZERO) {
      this.openAddressDetailsCollapse = true;
      this.tiersAddress = this.tiersToUpdate.Address;
    }
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  isFormChanged(): boolean {
    return this.tiersFormGroup.touched;
  }

  get PhoneNavigation(): FormControl {
    return this.tiersFormGroup.get(TiersConstants.PHONE_NAVIGATION) as FormControl;
  }

  get IdPhone(): FormControl {
    return this.tiersFormGroup.get(TiersConstants.ID_PHONE) as FormControl;
  }

  get Email(): FormControl {
    return this.tiersFormGroup.get(TiersConstants.EMAIL) as FormControl;
  }

  get Fax(): FormControl {
    return this.tiersFormGroup.get(TiersConstants.FAX) as FormControl;
  }

  get Facebook(): FormControl {
    return this.tiersFormGroup.get(TiersConstants.FACEBOOK) as FormControl;
  }

  get Linkdln(): FormControl {
    return this.tiersFormGroup.get(TiersConstants.LINKEDIN) as FormControl;
  }

  get Twitter(): FormControl {
    return this.tiersFormGroup.get(TiersConstants.TWITTER) as FormControl;
  }

  get AuthorizedAmountInvoice(): FormControl {
    return this.tiersFormGroup.get(TiersConstants.AUTHORIZED_AMOUNT_INVOICE) as FormControl;
  }
  get CIN(): FormControl {
    return this.tiersFormGroup.get(TiersConstants.CIN) as FormControl;
  }

  isValidPhone(isValidPhone) {
    if (isValidPhone || isNullOrEmptyString(this.PhoneNavigation.value.Number)) {
      this.tiersPhoneHasError = false;
      this.PhoneNavigation.setErrors(null);
      this.PhoneNavigation.markAsUntouched();
    } else {
      this.tiersPhoneHasError = true;
      this.PhoneNavigation.setErrors({'wrongPattern': Validators.pattern});
      this.PhoneNavigation.markAsTouched();
    }
  }

  onCountryPhoneChange(phoneInformation) {
    this.PhoneNavigation.get(PhoneConstants.PHONE_DIAL_CODE).setValue(phoneInformation.dialCode);
    this.PhoneNavigation.get(PhoneConstants.PHONE_COUNTRY_CODE).setValue(phoneInformation.iso2);
  }

  loadPhoneCountryFlag() {
    if (this.tiersToUpdate && this.tiersToUpdate.IdPhoneNavigation) {
      return this.tiersToUpdate.IdPhoneNavigation.CountryCode.toString().trim();
    }
  }

  isContactPhoneHasError(contactPhoneValid: boolean[]) {
    if (contactPhoneValid.includes(true)) {
      this.contactPhoneHasError = true;
    }
  }

  private checkIdPhoneNavigation(tiersToSave: Tiers) {
    if (tiersToSave.IdPhoneNavigation && !tiersToSave.IdPhoneNavigation.Number) {
      tiersToSave.IdPhoneNavigation = null;
      tiersToSave.IdPhone = null;
    } else {
      tiersToSave.IdPhoneNavigation.Number = +tiersToSave.IdPhoneNavigation.Number;
    }
    this.resetIdPhone(tiersToSave);
  }

  private resetIdPhone(tiersToSave: Tiers) {
    if (!tiersToSave.IdPhone && tiersToSave.IdPhoneNavigation) {
      tiersToSave.IdPhone = NumberConstant.ZERO;
    }
  }

  private checkInvalidFields() {
    const tiersInvalidControl = this.el.nativeElement.querySelector('form.ng-invalid');
    const addressInvalidControl = this.el.nativeElement.querySelector('.tiersAddress input.ng-invalid');
    const contactInvalidControl = this.el.nativeElement.querySelector('.tiersContact input.ng-invalid');
    const vehicleInvalidControl = this.el.nativeElement.querySelector('.tiersVehicle input.ng-invalid');
    if (addressInvalidControl) {
      this.validationService.scrollToInvalidField(addressInvalidControl);
    } else if (contactInvalidControl) {
      this.validationService.scrollToInvalidField(contactInvalidControl);
    } else if (tiersInvalidControl) {
      this.validationService.scrollToInvalidField(tiersInvalidControl);
    }  else if (vehicleInvalidControl) {
      this.validationService.scrollToInvalidField(vehicleInvalidControl);
    }
  }

  /**
   * remove the tiers picture on close click event
   * @param event
   */
  removeTiersPicture(event) {
    event.preventDefault();
    this.swalWarring.CreateDeleteSwal(ContactConstants.PICTURE_ELEMENT, ContactConstants.PRONOUN_CETTE).then((result) => {
      if (result.value) {
        this.pictureFileInfo = null;
        this.pictureTierSrc = null;
        this.tiersToUpdate.UrlPicture = null ;
      }
    });
  }

  /**
   * open the activty sectors combobox on focus event
   */
  openActivtySectorCombobox() {
    this.activitySectorComboBox.toggle(true);
  }

  /**
   * open the lead source combobox on focus event
   */
  openLeadSourceCombobox() {
    this.leadSourceComboBox.toggle(true);
  }


}

