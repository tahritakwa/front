import {Component, ComponentRef, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {unique, uniquePropCrmJavaServices, ValidationService} from '../../../../shared/services/validation/validation.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {Organisation} from '../../../../models/crm/organisation.model';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {ExactDate} from '../../../../shared/helpers/exactDate';
import {Employee} from '../../../../models/payroll/employee.model';
import {EmployeeService} from '../../../../payroll/services/employee/employee.service';
import {EnumValues} from 'enum-values';
import {ActivitySectorsEnum} from '../../../../models/shared/enum/activitySectors.enum';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {OpportunityType} from '../../../../models/crm/enums/opportunityType.enum';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {Tiers} from '../../../../models/achat/tiers.model';
import {PermissionService} from '../../../services/permission/permission.service';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {GenericCrmService} from '../../../generic-crm.service';
import {CurrencyService} from '../../../../administration/services/currency/currency.service';
import {StyleConfigService} from '../../../../shared/services/styleConfig/style-config.service';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../../stark-permissions/utils/utils';
import {TiersConstants} from '../../../../constant/purchase/tiers.constant';
import {DropdownService} from '../../../services/dropdowns/dropdown.service';

const NAME_REFERENCE = 'name';
const EMAIL_REFERENCE = 'email';
import {Address} from '../../../../models/crm/address.model';
import {TiersAddressComponent} from '../../../../shared/components/tiers-address/tiers-address.component';

@Component({
  selector: 'app-organisation-add',
  templateUrl: './organisation-add.component.html',
  styleUrls: ['./organisation-add.component.scss']
})
export class OrganisationAddComponent implements OnInit, IModalDialog {
  public optionDialog: Partial<IModalDialogOptions<any>>;

  public listResponsiblesUsers: Array<Employee>;
  public addOrganisationForm: FormGroup;
  public secondCollapseIsOpened: Boolean = false;
  public addressesCollapseIsOpened: Boolean = false;
  public datesToRememberCollapseIsOpened: Boolean = false;
  public datesToRememberFormGroup: FormGroup;
  private dataFromTeams;
  public teamsList = [];
  public activitySectors = [];
  public types = [];
  public organisationType = OpportunityType.PROSPECT;
  public prospect = 'PROSPECT';
  public client = 'CLIENT';
  public activitySectorsFiltred = [];
  public todayDate = new Date();
  public uuid = Math.floor(Math.random() * NumberConstant.ONE_THOUSAND);
  public isFromModal = false;
  public leadSources = [];
  public organisationsRelatedPermissions: any;
  private typeSubscription: Subscription;
  public prospectType = true;
  public mail = '';
  private readonly IS_PROSPECT_PARAM = CrmConstant.IS_PROSPECT_PARAM;
  formatSaleOptions: any;
  public parentPermission = 'ADD_ORGANIZATION';

  @ViewChild(NAME_REFERENCE) public nameInput: ElementRef;
  @ViewChild(EMAIL_REFERENCE) public emailInput: ElementRef;
  private isSaveOperation: boolean;
  public addressToConvert: Address;
  public typeTier: number;
  public tiersAddress = [];
  /**
   *
   * @param validationService
   * @param employeeService
   * @param fb
   * @param router
   * @param teamService
   * @param modalService
   * @param permissionService
   * @param growilService
   * @param swallService
   * @param exactDate
   * @param translate
   * @param organisationService
   * @param tiersService
   * @param route
   * @param genericCrmService
   * @param currencyService
   */
  constructor(
    private validationService: ValidationService,
    private fb: FormBuilder,
    private router: Router,
    private styleConfigService: StyleConfigService,
    private modalService: ModalDialogInstanceService,
    private permissionService: PermissionService,
    private growilService: GrowlService,
    private swallService: SwalWarring,
    private exactDate: ExactDate,
    private translate: TranslateService,
    private organisationService: OrganisationService,
    private tiersService: TiersService,
    private route: ActivatedRoute,
    private  genericCrmService: GenericCrmService,
    private currencyService: CurrencyService,
    private dropdownService: DropdownService) {

  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    if (options.data.prospectType === true) {
      this.organisationType = OpportunityType.PROSPECT;
    } else {
      this.organisationType = OpportunityType.CLIENT;
    }
    this.isFromModal = true;
  }

  ngOnInit() {
    this.typeTier=1;
    this.checkAndSetOrganizationType();
    this.createAddForm();
    this.selectedPermission();
    this.setIdCurrencyValidators();
    this.initLeadSources();
    this.addAddress();
    this.fillActivitySectors();
    this.fillTypes();
    this.addDatesToRemember();
  }

  private setIdCurrencyValidators() {
    if (!this.prospectType) {
      this.addOrganisationForm.controls['IdCurrency'].setValidators([Validators.required]);
    }
  }

  private checkAndSetOrganizationType() {
    this.typeSubscription = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to true if no query param provided.
        this.prospectType = isNotNullOrUndefinedAndNotEmptyValue(params)
        && isNotNullOrUndefinedAndNotEmptyValue(params['parameters'])
        && (JSON.parse(params['parameters']) !== null) ? JSON.parse(params['parameters']) : true;
        this.setOrganizationType();
      });
  }

  private setOrganizationType() {
    if (this.prospectType) {
      this.organisationType = OpportunityType.PROSPECT;
    } else {
      this.organisationType = OpportunityType.CLIENT;
    }
  }

  private initLeadSources() {
    this.dropdownService.getAllFiltreByName('SOURCE', 'ORGANIZATION')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.leadSources.push(filtreName.name);
            }
          );
        }
      });
  }

  fillActivitySectors() {
    this.dropdownService.getAllFiltreByName('ACTIVITY_SECTOR', 'ORGANIZATION')
      .subscribe(data => {
        if (data) {
          data.forEach((filtreName) => {
              this.activitySectors.push(filtreName.name);
              this.activitySectorsFiltred.push(filtreName.name);
            }
          );
        }
      });
  }

  fillTypes() {
    this.types = EnumValues.getNames(OpportunityType).map((type: any) => {
      return {enumValue: type, enumText: this.translate.instant(type)};
    });
  }

  private createAddForm(): void {
    this.addOrganisationForm = this.fb.group({
      name: ['', {
        validators: [Validators.required, Validators.pattern(CrmConstant.NAMES_PATTERN)],
        asyncValidators: this.prospectType ? uniquePropCrmJavaServices(OrganisationConstant.NAME, this.organisationService ,
          CrmConstant.INSERTED_ELEMENT) : unique(TiersConstants.NAME, this.tiersService, null) ,
        updateOn: 'blur'
      }],
      activitySector: ['', [Validators.required]],
      email: ['', {
        validators: [Validators.required, Validators.pattern(CrmConstant.MAIL_PATTERN)],
        asyncValidators: this.prospectType ? uniquePropCrmJavaServices(OrganisationConstant.EMAIL, this.organisationService ,
          CrmConstant.INSERTED_ELEMENT) : unique(TiersConstants.EMAIL, this.tiersService, null), updateOn: 'blur',
      }],
      telephone: [],
      fax: [NumberConstant.ZERO],
      team: [''],
      employeesPermittedTo: [''],
      linkedIn: [''],
      facebook: [''],
      twitter: [''],
      Id: [0.5],
      addresses: this.fb.array([]),
      Address: this.fb.array([]),
      datesToRemember: this.fb.array([]),
      description: [''],
      leadSource: [null],
      IdCurrency: ['', Validators.required]
    });
  }

  get email(): FormControl {
    return this.addOrganisationForm.controls['email'] as FormControl;
  }

  get name(): FormControl {
    return this.addOrganisationForm.controls['name'] as FormControl;
  }

  deleteAddress(i: number): void {
    this.addresses.removeAt(i);
  }

  get addresses(): FormArray {
    return this.addOrganisationForm.get(OrganisationConstant.ADDRESSES) as FormArray;
  }

  addAddress(): void {
    if (this.addresses.valid) {
    //  this.addresses.push(this.buildAddressForm());
    } else {
      this.validationService.validateAllFormGroups(this.addresses);
    }
  }

  checkNumberOfEventsName(eventName: string) {
    const datesToRemTab = [];
    (this.addOrganisationForm.get(OrganisationConstant.DATES_TO_REMIND) as FormArray).controls.forEach((date) => {
      datesToRemTab.push(date.value);
    });
    const valueArr = datesToRemTab.map(function (item) {
      return item.eventName;
    });
    const valueToReturn = valueArr.filter(item => item === eventName && item !== '').length;
    valueToReturn > 1 ? this.addOrganisationForm.controls[OrganisationConstant.DATES_TO_REMIND].setErrors({'incorrect': true}) :
      this.addOrganisationForm.controls[OrganisationConstant.DATES_TO_REMIND].setErrors(null);
    return valueToReturn;
  }

  saveOrganization() {
    this.deleteInValidAddresses();
    this.deleteInValidDates();
    if (this.addOrganisationForm.valid && this.organisationsRelatedPermissions.permissionValidForm) {
      let organisationToSend: Organisation;
      organisationToSend = this.convertAddOrganisationFormToOrganisation(this.addOrganisationForm);
      organisationToSend.currencyId = this.addOrganisationForm.value.IdCurrency;
      this.organisationService.getJavaGenericService().saveEntity(organisationToSend)
        .subscribe((data) => {
          this.isSaveOperation = true;
          const organisation = data;
          if (data) {
            if (!organisation.name || !organisation.email) {
              if (!organisation.name) {
                this.addOrganisationForm.controls[OrganisationConstant.NAME].markAsPending();
              }
              if (!organisation.email) {
                this.addOrganisationForm.controls[OrganisationConstant.EMAIL].markAsPending();
                this.secondCollapseIsOpened = true;
              }
            } else {
              this.permissionService.savePermission(this.organisationsRelatedPermissions,
                OrganisationConstant.ORGANISATION_ENTITY, data.id).subscribe(() => {
                this.growilService.successNotification(this.translate.instant(OrganisationConstant.SUCCESS_OPERATION));
                this.onBackToListOrCancel(true, data.id);
              });
            }
          }
        });
    } else {
      if (this.addOrganisationForm.controls[OrganisationConstant.EMAIL].invalid) {
        this.secondCollapseIsOpened = true;
        this.addOrganisationForm.controls[OrganisationConstant.EMAIL].markAsPending();
      }
      this.checkEventNameValidation();
      this.checkDateToRememberCollapse();
      this.validationService.validateAllFormFields(this.addOrganisationForm);
      this.returnValidationOnEventName();
    }
  }

  save() {
    if (this.organisationType === OpportunityType.PROSPECT) {
      this.saveOrganization();
    } else if (this.organisationType === OpportunityType.CLIENT) {
      this.saveClientOrganisation();
    }
  }

  private returnValidationOnEventName() {
    this.datesToRemember.controls.forEach((fg: FormGroup) => fg.controls['eventName'].setValidators([Validators.required,
      this.genericCrmService.uniqueValueInFormArray(Observable.of(this.datesToRemember), 'eventName')]));
  }

  private saveClientOrganisation() {
    this.deleteInValidAddresses();
    this.deleteInValidDates();
    if (this.addOrganisationForm.valid) {
      const organisation: Organisation = this.convertAddOrganisationFormToOrganisation(this.addOrganisationForm);
      const tiers: Tiers = Organisation.convertToTiers(organisation);
      tiers.IdCurrency = this.addOrganisationForm.value.IdCurrency;
      this.tiersService.saveTiers(tiers, true).subscribe((data) => {
        this.isSaveOperation = true;
        this.onBackToListOrCancel(false, data.Id);
      });
    } else {
      if (this.addOrganisationForm.controls[OrganisationConstant.EMAIL].invalid) {
        this.secondCollapseIsOpened = true;
      }
      this.checkEventNameValidation();
      this.checkDateToRememberCollapse();
      this.validationService.validateAllFormFields(this.addOrganisationForm);
      this.returnValidationOnEventName();
    }
  }

  onBackToListOrCancel(isProspect, id?) {
    if (!this.isFromModal) {
      this.router.navigateByUrl(OrganisationConstant.ORGANISATION_LIST_URL.concat(this.IS_PROSPECT_PARAM + isProspect));
    } else {
      if (!this.genericCrmService.isNullOrUndefinedOrEmpty(id)) {
        this.optionDialog.data = id;
      }
      this.optionDialog.onClose();

      this.modalService.closeAnyExistingModalDialog();
    }
  }

  checkDateToRememberCollapse() {
    (this.addOrganisationForm.get(OrganisationConstant.DATES_TO_REMIND) as FormArray).controls.forEach((formGr) => {
      if (formGr.invalid || this.checkNumberOfEventsName(formGr.get(ContactConstants.EVENT_NAME).value)) {
        this.datesToRememberCollapseIsOpened = true;
      }
    });
  }


  convertAddOrganisationFormToOrganisation(form: FormGroup) {
    let organisation: Organisation;
    organisation = form.value;
    organisation.datesToRemember.forEach((dateToRemember) => {
      dateToRemember.date = this.exactDate.getDateExact(dateToRemember.date);
    });
    organisation.addresses =   form.value.Address ;
    if (organisation.addresses !== null && organisation.addresses.length > 0 ) {
      organisation.addresses.forEach((e, index) => {
          e.id = form.value.Address[index].Id > 0 && this.organisationType === OpportunityType.PROSPECT ? form.value.Address[index].Id : null ;
          e.city = form.value.Address[index].City;
          e.country = form.value.Address[index].Country;
          e.idCountry = form.value.Address[index].IdCountry;
          e.idCity = form.value.Address[index].IdCity;
          e.label = form.value.Address[index].Label;
          e.principalAddress = form.value.Address[index].PrincipalAddress;
          e.region = form.value.Address[index].Region;
          e.zipCode =  form.value.Address[index].CodeZip;
          e.extraAddress =  form.value.Address[index].ExtraAdress;
        }
      );
    }
    if (!organisation.activitySector) {
      organisation.activitySector = ActivitySectorsEnum[ActivitySectorsEnum.OTHER];
    }
    organisation.currencyId = this.addOrganisationForm.value.currencyId;
    return organisation;
  }


  /**
   * dates to be reminded
   */

  get datesToRemember(): FormArray {
    return this.addOrganisationForm.get(OrganisationConstant.DATES_TO_REMIND) as FormArray;
  }

  createDatesToRemForm(): FormGroup {
    this.datesToRememberFormGroup = this.fb.group({
      eventName: new FormControl('', [Validators.required,
        this.genericCrmService.uniqueValueInFormArray(Observable.of(this.datesToRemember), 'eventName')]),
      date: new FormControl('', [Validators.required])
    });
    return this.datesToRememberFormGroup;
  }

  private checkEventNameValidation() {
    const invalidNameValue = this.datesToRemember.controls.find((fg: FormGroup) => fg.controls['eventName'].invalid);
    if (!invalidNameValue) {
      this.datesToRemember.controls.forEach((fg: FormGroup) => fg.controls['eventName'].clearValidators());
    } else {
      this.datesToRememberCollapseIsOpened = true;
    }
  }

  deleteInValidDates() {
    if (!this.datesToRememberCollapseIsOpened) {
      this.datesToRemember.controls.forEach((fg: FormGroup, index) => {
        if (fg.invalid) {
          this.datesToRemember.removeAt(index);
        }
      });
    }
  }

  deleteInValidAddresses() {
    if (!this.addressesCollapseIsOpened) {
      this.addresses.controls.forEach((fg: FormGroup, index) => {
        if (fg.invalid) {
          this.addresses.removeAt(index);
        }
      });
    }
  }

  deleteDateToRemember(i) {
    this.datesToRemember.removeAt(i);
  }

  addDatesToRemember() {
    if (this.datesToRemember.valid) {
      this.datesToRemember.push(this.createDatesToRemForm());
    } else {
      this.validationService.validateAllFormGroups(this.datesToRemember);
    }
  }

  checkSecondCollapse() {
    this.secondCollapseIsOpened = !this.secondCollapseIsOpened;
  }



  handleFiltreActivitySectors(value) {
    this.activitySectors = this.activitySectorsFiltred.filter(o => o.enumText.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  selectedPermission() {
    this.permissionService.getResult().subscribe(data => {
      if (data && data.permission && (data.parent === this.parentPermission)) {
        this.organisationsRelatedPermissions = data.permission;
      }
    });
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isOrganisationFormGroupChanged.bind(this));
  }

  isOrganisationFormGroupChanged(): boolean {
    return this.addOrganisationForm.touched;
  }


  /**get tiers Currency symbol */
  getSelectedCurrency(idCurrency) {
    if (idCurrency) {
      this.currencyService.getById(idCurrency.Id).subscribe(currency => {
        this.formatSaleOptions = {
          idCurrency: currency ? currency.Id : null,
          style: 'currency',
          currency: currency ? currency.Code : null,
          currencyDisplay: 'symbol',
          minimumFractionDigits: currency ? currency.Precision : null
        };
        this.addOrganisationForm.controls['IdCurrency'].setValue(this.formatSaleOptions.idCurrency);
      });
    }

  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }

  onNameMouseOut() {
    this.nameInput.nativeElement.blur();
  }

  onEmailMouseOut() {
    this.emailInput.nativeElement.blur();
  }

  public collapseAddressOpened = false;
  public openAddressDetailsCollapse = false;

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
    return (this.addOrganisationForm.get(TiersConstants.ADDRESS) as FormArray);
  }
}
